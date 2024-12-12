"use client";

import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import { useState } from "react";
import { addMonths } from "date-fns";
import { DateRange } from "react-day-picker";
import { FaBagShopping } from "react-icons/fa6";
import { GrPrevious } from "react-icons/gr";
import Link from "next/link";

const OrderHistoryForm: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState(listFilter[0].value);
  const [date, setDate] = useState<DateRange | undefined>({
    from: addMonths(new Date(), -6),
    to: new Date(),
  });

  const handleChangeFilter = (value: string) => {
    setSelectedFilter(value);
  };
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
                item.value === selectedFilter && "border-red-500"
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
        <div className="h-[500px] border border-neutral-300 rounded-lg flex flex-col gap-4 mt-4 overflow-x-hidden overflow-y-scroll custom-scrollbar shadow-md">
          <div className="sticky top-0 grid grid-cols-[2fr_1fr_1fr] border-b py-2 px-4 bg-red-400 text-white">
            <div>Sản phẩm</div>
            <div>Ngày đặt hàng</div>
            <div>Tổng số tiền</div>
          </div>
          {orders.map((order, index) => {
            return (
              <div
                key={index}
                className={`grid grid-cols-[2fr_1fr_1fr] px-4 pb-4 ${
                  index === orders.length ? "border-b-0" : "border-b"
                }`}
              >
                <div className="flex flex-col gap-1">
                  {order.items.map((product, index) => {
                    return (
                      <div key={index}>
                        {product.name} x{product.quantity}
                      </div>
                    );
                  })}
                </div>
                <div>{order.date}</div>
                <div> {Number(order.total).toLocaleString("vi-en")}</div>
              </div>
            );
          })}
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

const orders: Order[] = [
  {
    id: "1",
    items: [
      {
        id: "1",
        name: "dien thoai a",
        quantity: 2,
      },
      {
        id: "2",
        name: "dien thoai b",
        quantity: 3,
      },
      {
        id: "3",
        name: "dien thoai c",
        quantity: 3,
      },
    ],
    date: "20/11/2023",
    total: 10000000,
  },
  {
    id: "2",
    items: [
      {
        id: "1",
        name: "dien thoai a",
        quantity: 2,
      },
      {
        id: "2",
        name: "dien thoai b",
        quantity: 3,
      },
      {
        id: "3",
        name: "dien thoai c",
        quantity: 3,
      },
    ],
    date: "20/11/2023",
    total: 20000000,
  },
  {
    id: "3",
    items: [
      {
        id: "1",
        name: "dien thoai a",
        quantity: 2,
      },
      {
        id: "2",
        name: "dien thoai b",
        quantity: 3,
      },
      {
        id: "3",
        name: "dien thoai c",
        quantity: 3,
      },
    ],
    date: "20/11/2023",
    total: 30000000,
  },
  {
    id: "4",
    items: [
      {
        id: "1",
        name: "dien thoai a",
        quantity: 2,
      },
      {
        id: "2",
        name: "dien thoai b",
        quantity: 3,
      },
      {
        id: "3",
        name: "dien thoai c",
        quantity: 3,
      },
    ],
    date: "20/11/2023",
    total: 10000000,
  },
  {
    id: "5",
    items: [
      {
        id: "1",
        name: "dien thoai a",
        quantity: 2,
      },
      {
        id: "2",
        name: "dien thoai b",
        quantity: 3,
      },
      {
        id: "3",
        name: "dien thoai c",
        quantity: 3,
      },
    ],
    date: "20/11/2023",
    total: 10000000,
  },
];

// const orders: Order[] = [];
