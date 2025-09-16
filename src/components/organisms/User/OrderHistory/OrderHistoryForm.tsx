"use client";

import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import { useEffect, useState } from "react";
import { addMonths } from "date-fns";
import { DateRange } from "react-day-picker";
import { FaBagShopping } from "react-icons/fa6";
import { GrPrevious } from "react-icons/gr";
import Link from "next/link";
import { getAllOrderByUserId, updateOrder } from "@/lib";
import { useUserStore } from "@/store/user";
import Loading from "../../Loading";
import { toast } from "sonner";

const OrderHistoryForm: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const [selectedFilter, setSelectedFilter] = useState(listFilter[0].value);
  const [isLoading, setisLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: addMonths(new Date(), -6),
    to: new Date(),
  });

  const handleChangeFilter = (value: string) => {
    setSelectedFilter(value);
  };
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString); // Tạo đối tượng Date từ chuỗi

    // Lấy ngày, tháng, năm
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    // Lấy giờ, phút, giây
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    // Trả về chuỗi định dạng "dd/mm/yyyy hh:mm:ss"
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleCancelOrder = async (orderId: string) => {
    setisLoading(true);
    const result = await updateOrder({ orderId, status: "Đã hủy" });
    if (result.success) {
      toast.info("Đã hủy đơn hàng");
      const result1 = await getAllOrderByUserId(user.id, selectedFilter);
      if (result1.success) {
        setOrders(result1.data.orders);
      }
    }
    setisLoading(false);
  };

  useEffect(() => {
    const fecthData = async () => {
      setisLoading(true);
      const result = await getAllOrderByUserId(user.id, selectedFilter);
      if (result.success) {
        setOrders(result.data.orders);
      }
      setisLoading(false);
    };
    if (user) {
      fecthData();
    }
  }, [selectedFilter, user]);

  return (
    <div>
      <div className="flex gap-6 items-baseline">
        <p className="font-medium text-neutral-700 text-xl mb-4 ">
          Đơn hàng đã mua
        </p>
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>

      {/* filter */}

      <div className="flex flex-wrap gap-4">
        {listFilter.map((item, index) => {
          return (
            <button
              type="button"
              key={index}
              className={`block rounded-md border border-neutral-400 px-4 py-1 ${
                item.value === selectedFilter && "border-red-500 border-2"
              }`}
              onClick={() => handleChangeFilter(item.value)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* items */}
      {orders.length > 0 ? (
        <div
          className={`h-[500px] border border-neutral-300 rounded-lg flex flex-col ${
            isLoading ? "gap-0" : "gap-4"
          }  mt-4 overflow-x-hidden overflow-y-scroll custom-scrollbar shadow-md`}
        >
          <div
            className={`sticky top-0 grid ${
              selectedFilter === "pending"
                ? "grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr]"
                : "grid-cols-[2fr_1fr_1fr_1fr_1fr]"
            }  border-b py-2 px-4 bg-red-400 text-white`}
          >
            <div>Sản phẩm</div>
            <div>Phương thức</div>
            <div>Trạng thái</div>
            <div>Ngày đặt hàng</div>
            <div>Tổng số tiền</div>
            {selectedFilter === "pending" && <div></div>}
          </div>

          {isLoading ? (
            <div className="h-[500px] border border-neutral-300 rounded-lg flex flex-col items-center justify-center gap-6">
              <Loading fullWeb={false} hasOverLay={false} />
            </div>
          ) : (
            orders.map((order, index) => {
              return (
                <div
                  key={index}
                  className={`grid ${
                    selectedFilter === "pending"
                      ? "grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr]"
                      : "grid-cols-[2fr_1fr_1fr_1fr_1fr]"
                  } px-4 pb-4 ${
                    index === orders.length ? "border-b-0" : "border-b"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    {order.items.map((product, index) => {
                      return (
                        <div key={index}>
                          {product.Variant.name} x{product.quantity}
                        </div>
                      );
                    })}
                  </div>
                  <div>{order.payment_method}</div>
                  <div>{order.payment_status}</div>
                  <div>{formatDateTime(order.createdAt)}</div>
                  <div>
                    {" "}
                    {Number(order.total_amount).toLocaleString("vi-en")}đ
                  </div>
                  {selectedFilter === "pending" && (
                    <button
                      type="button"
                      className="bg-red-500 rounded-md flex items-center justify-center px-4 py-2 text-white hover:bg-red-400 transition duration-300"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Hủy đơn
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="h-[500px] border border-neutral-300 rounded-lg flex flex-col items-center justify-center gap-6 mt-4">
          <FaBagShopping size={60} className="text-red-500" />
          <h5 className="text-xl font-semibold">
            Rất tiếc, không tìm thấy đơn hàng nào phù hợp
          </h5>
          <p className="text-neutral-400 mb-2">
            Vẫn còn nhiều sản phẩm đang chờ bạn
          </p>
          <Link
            href="/"
            className="flex items-center gap-4 text-red-600 hover:underline transition duration-300"
          >
            <GrPrevious size={14} />
            Về trang chủ
          </Link>
        </div>
      )}
    </div>
  );
};
export default OrderHistoryForm;

const listFilter = [
  {
    label: "Tất cả",
    value: "all",
  },
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
