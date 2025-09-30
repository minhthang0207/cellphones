"use client";
import useCartStore from "@/store/cart";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from "react";
import { BsCart4 } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";

import CartItemForm from "./CartItemForm";
import Link from "next/link";
import { CartItem, ItemCheckout } from "@/types/cart";
import { useUserStore } from "@/store/user";
import { Label } from "@/components/ui/label";
import { createOrder, createPayment } from "@/lib";
import { toast } from "sonner";
import Loading from "../Loading";
import { useRouter, useSearchParams } from "next/navigation";

const CartPage: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<ItemCheckout[]>([]);
  const cart = useCartStore((state) => state.cart);
  const user = useUserStore((state) => state.user);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("Khi nhận hàng");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // Lấy query params từ URL
  const id = searchParams.get("product");

  const handleCheckboxChange = (productItem: CartItem) => {
    setSelectedItems((prev) =>
      prev.some((item) => item.variant_id === productItem.variant_id)
        ? prev.filter((item) => item.variant_id !== productItem.variant_id)
        : [
            ...prev,
            {
              variant_id: productItem.variant_id,
              quantity: productItem.quantity,
              price: productItem.Variant.price,
              image_url: productItem.Variant.Product.image,
              name: productItem.Variant.name,
              stock_quantity: productItem.Variant.stock_quantity,
            },
          ]
    );
  };

  useEffect(() => {
    const newTotal = selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotalAmount(newTotal);
  }, [selectedItems]);

  useEffect(() => {
    if (id) {
      const exists = cart.find((item: CartItem) => item.variant_id === id);
      if (exists) {
        setSelectedItems([
          {
            variant_id: exists.variant_id,
            quantity: exists.quantity,
            price: exists.Variant.price,
            image_url: exists.Variant.Product.image,
            name: exists.Variant.name,
            stock_quantity: exists.Variant.stock_quantity,
          },
        ]);
      }
    }
  }, [id, cart]);

  const handleInvoiceCreation = async () => {
    setIsLoading(true);

    if (!user.name || !user.address) {
      toast.info(
        "Quý khách vui lòng nhập đầy đủ thông tin cá nhân trước khi thanh toán"
      );
      return router.push("/lich-su-mua-hang/thong-tin-nguoi-dung");
    }

    selectedItems.forEach((item) => {
      if (item.quantity > item.stock_quantity) {
        toast.error(
          `Sản phẩm ${item.name} không đủ số lượng trong kho. Còn lại ${item.stock_quantity} sản phẩm.`
        );
        return;
      }
    });

    if (paymentMethod === "Online") {
      const result = await createPayment(selectedItems, totalAmount, user.id);
      if (result.success) {
        await fetchCart(user.id);
        console.log(result.data)
        router.push(result.data.order_url);
      } else {
        toast.error(result.message);
      }
    } else {
      const result = await createOrder(
        selectedItems,
        totalAmount,
        paymentMethod,
        user.id
      );
      if (result.success) {
        await fetchCart(user.id);
        toast.success("Đặt hàng thành công");
        return router.push("/lich-su-mua-hang");
      } else {
        toast.error(result.message);
      }
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading fullWeb={true} hasOverLay={true} />;
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto h-fit p-4">
        <div className="w-[90%] md:w-[60%] h-[500px] mx-auto border rounded-lg border-red-500 p-4 shadow-lg">
          <h4 className="mx-auto text-center text-2xl font-bold mb-6">
            Giỏ hàng
          </h4>
          <p className="text-center text-neutral-500 mt-12 ">
            Hiện tại chưa có sản phẩm nào trong giỏ hàng
          </p>
          <div className="mx-auto mt-12 flex items-center justify-center">
            <BsCart4 size={130} className="text-neutral-400" />
          </div>
          <Link
            href="/"
            className="text-red-600 underline text-center mt-8 block"
          >
            Tìm kiếm sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto h-fit p-4">
      <div className="w-[90%] md:w-[60%] mx-auto border rounded-lg border-red-500 p-4 shadow-lg">
        <h4 className="mx-auto text-center text-2xl font-bold mb-6">
          Giỏ hàng
        </h4>
        <div className="flex flex-col gap-4">
          {cart.map((item, index) => (
            <CartItemForm
              item={item}
              key={item.id}
              index={index}
              onCheckboxChange={handleCheckboxChange}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          ))}
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="w-[90%] md:w-[60%] h-fit mx-auto border rounded-lg border-red-500 p-4 mt-8 shadow-lg overflow-auto ">
          <div className=" w-full h-full">
            <h6 className="font-bold text-xl uppercase">Đơn hàng của bạn</h6>
            <Link
              href="/lich-su-mua-hang/thong-tin-nguoi-dung"
              className="bg-neutral-200 rounded-lg p-2 mt-4 hover:bg-neutral-300 duration-200 transition block"
            >
              <p>
                <span className="font-bold">Người nhận: </span>
                {user.name} - {user.phone}
              </p>
              <p className="text-neutral-400 flex items-center gap-2 mt-2">
                <FaLocationDot className="text-red-500" size={18} />
                {user.address}
              </p>
            </Link>

            <div className="py-2 mt-4 border-b flex justify-between ">
              <p className="text-lg font-bold uppercase ">Sản phẩm</p>
              <p className="text-lg font-bold uppercase ">Giá tiền</p>
            </div>
            <div className="w-full flex flex-col gap-4 mt-4">
              {selectedItems.map((item) => {
                return (
                  <div
                    key={item.variant_id}
                    className="w-full flex justify-between items-center"
                  >
                    <p className="text-neutral-600 ">
                      {item.name} x {item.quantity}
                    </p>
                    <p className="text-red-500">
                      {Number(item.price * item.quantity).toLocaleString(
                        "vi-en"
                      )}
                      đ
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-between items-center border-b py-2">
              <p className="text-lg font-bold uppercase ">Tổng</p>
              <p className="text-red-500">
                {Number(totalAmount).toLocaleString("vi-en")}đ
              </p>
            </div>
            <div className="mt-4 flex flex-col   gap-4">
              <p className="text-lg font-bold uppercase ">
                Hình thức thanh toán
              </p>
              <div className="flex gap-4">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value)}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center gap-2 ">
                    <RadioGroupItem value="Khi nhận hàng" id="paymentmethod1" />
                    <Label htmlFor="paymentmethod1">
                      Thanh toán khi nhận hàng
                    </Label>
                  </div>
                  {paymentMethod === "Khi nhận hàng" && (
                    <p className="text-neutral-600 text-sm ">
                      Đơn hàng sẽ được tạo ngay lập tức, hóa đơn sẽ được thanh
                      toán ngay khi khách hàng nhận được hàng
                    </p>
                  )}
                  <div className="flex items-center gap-2  ">
                    <RadioGroupItem value="Online" id="paymentmethod2" />
                    <Label htmlFor="paymentmethod2">Thanh toán Online</Label>
                  </div>
                  {paymentMethod === "Online" && (
                    <p className="text-neutral-600 text-sm ">
                      Khách hàng sẽ được chuyển đến trang thanh toán và thanh
                      toán hàng (Sau khi thanh toán xong hóa đơn sẽ được cập
                      nhật vào hệ thống)
                    </p>
                  )}
                </RadioGroup>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 bg-primary-500 px-12 py-2 uppercase text-white font-bold text-lg rounded-md"
              onClick={handleInvoiceCreation}
              disabled={selectedItems.length === 0}
            >
              Đặt hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default CartPage;

// const cartItems = [
//   {
//     id: "3057f21e-a4a9-491d-a343-267a35b0639a",
//     quantity: 400,
//     user_id: "cb29cfcb-b9a7-41c8-936b-59113c7bf218",
//     variant_id: "7247692a-fa5f-4261-af4c-a3ff1ca81683",
//     createdAt: "2024-12-24T11:27:38.000Z",
//     updatedAt: "2024-12-24T11:27:38.000Z",
//     Variant: {
//       id: "7247692a-fa5f-4261-af4c-a3ff1ca81683",
//       name: "acer đỏ 8gb rom256",
//       price: 30000000,
//       ram_id: "aff34519-015f-48e7-b237-4f09ff03702a",
//       rom_id: "ee285082-faae-4a12-9a1c-cec00a4e8259",
//       color_id: "672f4b1f-5983-45ee-9cf3-829ced4ceb75",
//       Product: {
//         name: "AcerNitro5",
//         image:
//           "https://storage.googleapis.com/lamba-blog.appspot.com/products/1734718888948_danghinhthanham.jpg",
//       },
//       Ram: {
//         id: "aff34519-015f-48e7-b237-4f09ff03702a",
//         capacity: 8,
//       },
//       Rom: {
//         id: "ee285082-faae-4a12-9a1c-cec00a4e8259",
//         capacity: 256,
//       },
//       Color: {
//         id: "672f4b1f-5983-45ee-9cf3-829ced4ceb75",
//         name: "đỏ",
//         code: "#ff0000",
//       },
//     },
//   },
// ];
