"use client";
import Loading from "@/components/organisms/Loading";
import { getAllOrder } from "@/lib";
import { useEffect, useState } from "react";

import SingleOrder from "./SingleOrder";

const ManageOrderForm: React.FC = () => {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsTableLoading(false);
      const result = await getAllOrder();
      if (result.success) {
        setOrders(result.data.orders);
      }
      setIsTableLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h4 className="uppercase text-lg font-bold my-t mb-4">
        Danh sách người dùng
      </h4>
      <div className="bg-white w-full">
        <table
          className={`min-w-full bg-white border border-gray-200 ${
            (orders.length === 0 && "h-full") || (isTableLoading && "h-full")
          }`}
        >
          <thead>
            <tr className="bg-red-400">
              <th className="py-2 px-4 border-b rounded-tl-md">STT</th>
              <th className="py-2 px-4 border-b">Mã đơn hàng</th>
              <th className="py-2 px-4 border-b">HT thanh toán</th>
              <th className="py-2 px-4 border-b">TT thanh toán</th>
              <th className="py-2 px-4 border-b">Ngày đặt hàng</th>
              <th className="py-2 px-4 border-b">TT đơn hàng</th>
              <th className="py-2 px-4 border-b rounded-tr-md"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isTableLoading ? (
              // Hiển thị vòng tròn xoay khi đang tải
              <tr>
                <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                  <Loading fullWeb={false} />
                </td>
              </tr>
            ) : orders && orders.length > 0 ? (
              // Hiển thị danh sách khi có dữ liệu
              orders.map((item, index) => (
                <SingleOrder
                  key={item.id}
                  index={index}
                  item={item}
                  listFilter={listFilter}
                  isTableLoading={isTableLoading}
                  setIsTableLoading={setIsTableLoading}
                />
              ))
            ) : (
              // Hiển thị thông báo khi không có dữ liệu
              <tr>
                <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                  Không tìm thấy kết quả
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrderForm;

const listFilter = [
  {
    label: "Chờ xác nhận",
    value: "pending",
  },
  {
    label: "Đã xác nhận",
    value: "confirmed",
  },
  {
    label: "Đang vận chuyển",
    value: "transit",
  },
  {
    label: "Đã giao hàng",
    value: "delivered",
  },
  {
    label: "Đã hủy",
    value: "canceled",
  },
];
