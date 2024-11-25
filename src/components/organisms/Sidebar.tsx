"use client";
import React, { useState } from "react";
import Link from "next/link"; // Import cho điều hướng
import { FaChevronRight, FaHeadphonesAlt } from "react-icons/fa";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { FaLaptop } from "react-icons/fa6";
import { BsWatch, BsFillUsbDriveFill, BsSmartwatch } from "react-icons/bs";
import { TbDeviceDesktop } from "react-icons/tb";

// import Image from "next/image";

const Sidebar = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categories = [
    {
      name: "Điện thoại, Máy tính bảng",
      icon: <IoPhonePortraitOutline size={22} />,
      link: "/products/iphone",
      subcategories: [
        {
          name: "Điện thoại",
          items: [
            { name: "iPhone", link: "/products/iphone" },
            { name: "Samsung", link: "/products/samsung" },
            { name: "Xiaomi", link: "/products/xiaomi" },
            { name: "Nokia", link: "/products/nokia" },
          ],
        },
        {
          name: "Máy tính bảng",
          items: [
            { name: "iPhone", link: "/products/iphone" },
            { name: "Samsung", link: "/products/samsung" },
            { name: "Xiaomi", link: "/products/xiaomi" },
            { name: "Nokia", link: "/products/nokia" },
          ],
        },
      ],
    },
    {
      name: "Laptop",
      icon: <FaLaptop size={22} />,
      link: "/products/iphone",
      subcategories: [
        {
          name: "Thương hiệu",
          items: [
            { name: "MacBook", link: "/products/macbook" },
            { name: "Dell", link: "/products/dell" },
            { name: "HP", link: "/products/hp" },
            { name: "Lenovo", link: "/products/lenovo" },
          ],
        },
        {
          name: "Chip",
          items: [
            { name: "Intel", link: "/products/intel" },
            { name: "AMD", link: "/products/amd" },
            { name: "M1/M2", link: "/products/m1-m2" },
          ],
        },
      ],
    },
    {
      name: "Phụ kiện",
      icon: <BsFillUsbDriveFill size={22} />,
      link: "/products/iphone",
      subcategories: [
        {
          name: "Phụ kiện di động",
          items: [
            { name: "Dán màn hình", link: "/products/headphones" },
            { name: "Ốp lưng", link: "/products/cables" },
            { name: "Cáp sạc", link: "/products/cases" },
            { name: "Pin dự phòng", link: "/products/powerbanks" },
          ],
        },
        {
          name: "Phụ kiện máy tính",
          items: [
            { name: "Chuột", link: "/products/headphones" },
            { name: "Bàn phím", link: "/products/cables" },
            { name: "Thảm lót chuột", link: "/products/cases" },
            { name: "Sạc laptop", link: "/products/powerbanks" },
          ],
        },
      ],
    },
    {
      name: "Tai nghe",
      icon: <FaHeadphonesAlt size={22} />,
      subcategories: [
        {
          name: "Hãng tai nghe",
          items: [
            { name: "Apple", link: "/products/iphone" },
            { name: "Sony", link: "/products/samsung" },
            { name: "JBL", link: "/products/xiaomi" },
            { name: "Huawai", link: "/products/nokia" },
            { name: "Xiaomi", link: "/products/nokia" },
          ],
        },
      ],
    },
    {
      name: "Đồng hồ",
      icon: <BsWatch size={22} />,
      link: "/products/iphone",
      // subcategories: [
      //   {
      //     name: "Thương hiệu",
      //     items: [
      //       { name: "Apple Watch", link: "/products/iphone" },
      //       { name: "Samsung", link: "/products/samsung" },
      //       { name: "Xiaomi", link: "/products/xiaomi" },
      //       { name: "Huawai", link: "/products/nokia" },
      //       { name: "Black Shark", link: "/products/nokia" },
      //     ],
      //   },
      // ],
    },
    {
      name: "SmartWatch",
      icon: <BsSmartwatch size={22} />,
      link: "/products/iphone",
      // subcategories: [
      //   {
      //     name: "Thương hiệu",
      //     items: [
      //       { name: "Apple Watch", link: "/products/iphone" },
      //       { name: "Samsung", link: "/products/samsung" },
      //       { name: "Xiaomi", link: "/products/xiaomi" },
      //       { name: "Huawai", link: "/products/nokia" },
      //       { name: "Black Shark", link: "/products/nokia" },
      //     ],
      //   },
      // ],
    },
    {
      name: "Màn hình",
      icon: <TbDeviceDesktop size={22} />,
      link: "/products/iphone",
    },
  ];

  return (
    <div className="relative" onMouseLeave={() => setHoveredCategory(null)}>
      {/* Sidebar (300px) */}
      <div className="relative z-10 w-[300px] bg-white border shadow-md rounded-lg text-neutral-700">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 cursor-pointer transition duration-300 hover:text-red-600"
            onMouseEnter={() => setHoveredCategory(category.name)} // Hiển thị subcategories
          >
            <div className="flex items-center gap-4">
              {category.icon}
              <span>{category.name}</span>
            </div>
            {category.subcategories !== undefined && <FaChevronRight />}
          </div>
        ))}
      </div>
      {/* Content hover */}
      {categories.map(
        (category, index) =>
          hoveredCategory === category.name &&
          category.subcategories !== undefined && (
            <div
              key={index}
              className="absolute z-10 top-0 bottom-0 left-[300px] w-fit bg-white border shadow-md rounded-lg"
              onMouseEnter={() => {} /* Giữ nguyên trạng thái */}
            >
              <div
                className="p-4 flex gap-14 h-full"
                style={{ animation: "fadeIn 0.2s" }}
              >
                {category?.subcategories.map((subcategory, subIndex) => (
                  <div key={subIndex} className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 uppercase whitespace-nowrap">
                      {subcategory.name}
                    </h2>
                    <ul className="list-none h-full flex flex-col gap-3 pt-4 min-w-[200px]">
                      {subcategory?.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="">
                          <Link
                            href={item.link}
                            className="hover:text-red-600 transition duration-300 rounded block"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default Sidebar;
