"use client";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useUserStore } from "@/store/user";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from "next/image";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from "react";

const CartPage: React.FC = () => {
  //   const [selectedItems, setSelectedItems] = useState<string[]>([]);
  //   const user = useUserStore((state) => state.user);
  //   console.log(user);

  //   const handleCheckboxChange = (id: string) => {
  //     setSelectedItems((prev) =>
  //       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  //     );
  //   };

  //   const handleInvoiceCreation = () => {
  //     const selectedProducts = cartItems.filter((item) =>
  //       selectedItems.includes(item.id)
  //     );
  //     console.log("Selected Products for Invoice:", selectedProducts);
  //   };
  return (
    <div className="max-w-[1280px] mx-auto h-fit p-4">
      <h4 className="mx-auto text-center text-2xl font-bold">Giỏ hàng</h4>
      {/* <div>
        {cartItems.map((item) => (
          <div key={item.id}>
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={() => handleCheckboxChange(item.id)}
            />
            <Image
              width={100}
              height={100}
              src={item.Variant.Product.image}
              alt={item.Variant.Product.name}
            />
            <div>
              <h3>{item.Variant.Product.name}</h3>
              <p>Biến thể: {item.Variant.name}</p>
              <p>Giá: {item.Variant.price.toLocaleString()} VND</p>
              <p>
                Ram: {item.Variant.Ram.capacity}GB | Rom:{" "}
                {item.Variant.Rom.capacity}GB
              </p>
              <p>
                Màu sắc:{" "}
                <span style={{ color: item.Variant.Color.code }}>
                  {item.Variant.Color.name}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleInvoiceCreation}
        disabled={selectedItems.length === 0}
      >
        Tạo hóa đơn
      </button> */}
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
