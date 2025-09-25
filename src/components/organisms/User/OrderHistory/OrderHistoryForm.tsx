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
import { Combobox } from "@/components/ui/combobox";

interface StatusOrder {
  id: string;
  label: string;
  value: string;
}

const OrderHistoryForm: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const [selectedFilter, setSelectedFilter] = useState<StatusOrder>(listFilter[0]);
  const [isLoading, setisLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: addMonths(new Date(), -6),
    to: new Date(),
  });

  const handleChangeFilter = (item: StatusOrder) => {
    setSelectedFilter(item);
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
      const result1 = await getAllOrderByUserId(user.id, selectedFilter.value);
      if (result1.success) {
        setOrders(result1.data.orders);
      }
    }
    setisLoading(false);
  };

  useEffect(() => {
    const fecthData = async () => {
      setisLoading(true);
      const result = await getAllOrderByUserId(user.id, selectedFilter.value);
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
      <div className="flex flex-col gap-2 md:flex-row md:gap-6 items-baseline">
        <p className="font-medium text-neutral-700 text-xl md:mb-4 ">
          Đơn hàng đã mua
        </p>
        <div className="w-full max-w-[300px]">
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
      </div>

      {/* filter */}

      <div className="hidden md:flex flex-wrap gap-4">
        {listFilter.map((item, index) => {
          return (
            <button
              type="button"
              key={index}
              className={`block rounded-md border border-neutral-400 px-4 py-1 ${
                item.value === selectedFilter.value && "border-red-500 border-2"
              }`}
              onClick={() => handleChangeFilter(item)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="md:hidden mt-2 w-full max-w-[300px]">
        <span>
          Trạng thái đơn hàng
        </span>
        <div className="mt-2">
          <Combobox<StatusOrder>
            selectedItem={selectedFilter.label}
            data={listFilter}
            label="Chọn trạng thái đơn hàng"
            placeholder="Tìm kiếm Tỉnh, Thành"
            handleSelect={handleChangeFilter}
            showSearch={false}
          />
        </div>
      </div>

      <div className="mt-4 font-semibold md:hidden text-red-400">DANH SÁCH ĐƠN HÀNG</div>

      {/* items */}
      {orders.length > 0 ? (
        <div
          className={`h-[500px] border border-neutral-300 rounded-lg flex flex-col ${
            isLoading ? "gap-0" : "gap-4"
          } mt-4 overflow-x-hidden overflow-y-scroll custom-scrollbar shadow-md`}
        >
          {/* Header chỉ hiện ở desktop */}
          <div
            className={`sticky top-0 hidden md:grid ${
              selectedFilter.value === "pending"
                ? "grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr]"
                : "grid-cols-[2fr_1fr_1fr_1fr_1fr]"
            } border-b py-2 px-4 bg-red-400 text-white`}
          >
            <div>Sản phẩm</div>
            <div>Phương thức</div>
            <div>Trạng thái</div>
            <div>Ngày đặt hàng</div>
            <div>Tổng số tiền</div>
            {selectedFilter.value === "pending" && <div></div>}
          </div>

          {isLoading ? (
            <div className="h-[500px] border border-neutral-300 rounded-lg flex flex-col items-center justify-center gap-6">
              <Loading fullWeb={false} hasOverLay={false} />
            </div>
          ) : (
            orders.map((order, index) => (
              <div
                key={index}
                className={`px-4 pb-4 border-b ${
                  index === orders.length ? "border-b-0" : "border-b"
                }`}
              >
                {/* Desktop row */}
                <div
                  className={`hidden md:grid ${
                    selectedFilter.value === "pending"
                      ? "grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr]"
                      : "grid-cols-[2fr_1fr_1fr_1fr_1fr]"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    {order.items.map((product, i) => (
                      <div key={i}>
                        {product.Variant.name} x{product.quantity}
                      </div>
                    ))}
                  </div>
                  <div>{order.payment_method}</div>
                  <div>{order.payment_status}</div>
                  <div>{formatDateTime(order.createdAt)}</div>
                  <div>{Number(order.total_amount).toLocaleString("vi-en")}đ</div>
                  {selectedFilter.value === "pending" && (
                    <button
                      type="button"
                      className="bg-red-500 rounded-md flex items-center justify-center px-4 py-2 text-white hover:bg-red-400 transition duration-300"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Hủy đơn
                    </button>
                  )}
                </div>

                {/* Mobile card */}
                <div className="flex flex-col gap-2 md:hidden bg-white rounded-lg p-3 shadow-sm">
                  <div>
                    <span className="font-semibold">Sản phẩm: </span>
                    {order.items.map((product, i) => (
                      <span key={i}>
                        {product.Variant.name} x{product.quantity}{" "}
                      </span>
                    ))}
                  </div>
                  <div>
                    <span className="font-semibold">Phương thức: </span>
                    {order.payment_method}
                  </div>
                  <div>
                    <span className="font-semibold">Trạng thái: </span>
                    {order.payment_status}
                  </div>
                  <div>
                    <span className="font-semibold">Ngày đặt hàng: </span>
                    {formatDateTime(order.createdAt)}
                  </div>
                  <div>
                    <span className="font-semibold">Tổng: </span>
                    {Number(order.total_amount).toLocaleString("vi-en")}đ
                  </div>
                  {selectedFilter.value === "pending" && (
                    <button
                      type="button"
                      className="bg-red-500 rounded-md flex items-center justify-center px-4 py-2 text-white hover:bg-red-400 transition duration-300"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Hủy đơn
                    </button>
                  )}
                </div>
              </div>
            ))
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
    id: "1",
    label: "Tất cả",
    value: "all",
  },
  {
    id: "2",
    label: "Chờ xác nhận",
    value: "pending",
  },
  {
    id: "3",
    label: "Đã xác nhận",
    value: "confirmed",
  },
  {
    id: "4",
    label: "Đang vận chuyển",
    value: "transit",
  },
  {
    id: "5",
    label: "Đã giao hàng",
    value: "delivered",
  },
  {
    id: "6",
    label: "Đã hủy",
    value: "canceled",
  },
];
