"use client";
import React, { useState } from "react";
import Link from "next/link"; // Import cho điều hướng
import { FaChevronRight, FaHeadphonesAlt } from "react-icons/fa";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { FaLaptop } from "react-icons/fa6";
import { BsWatch } from "react-icons/bs";
import { TbDeviceDesktop } from "react-icons/tb";
import { FaTabletAlt } from "react-icons/fa";

// import Image from "next/image";

const Sidebar = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categories = [
    {
      name: "Điện thoại",
      icon: <IoPhonePortraitOutline size={22} />,
      link: "/dien-thoai",
      subcategories: [
        {
          name: "Điện thoại",
          items: [
            { name: "iPhone", link: "/dien-thoai?thuonghieu=iphone" },
            { name: "Samsung", link: "/dien-thoai?thuonghieu=samsung" },
            { name: "Xiaomi", link: "/dien-thoai?thuonghieu=xiaomi" },
            { name: "Nokia", link: "/dien-thoai?thuonghieu=oppo" },
          ],
        },
      ],
    },
    {
      name: "Máy tính bảng",
      icon: <FaTabletAlt size={22} />,
      link: "/may-tinh-bang",
      subcategories: [
        {
          name: "Thương hiệu",
          items: [
            { name: "Ipad", link: "/may-tinh-bang?thuonghieu=ipad" },
            { name: "Samsung", link: "/may-tinh-bang?thuonghieu=sámung" },
            { name: "Xiaomi", link: "/may-tinh-bang?thuonghieu=xiaomi" },
            { name: "Huawei", link: "/may-tinh-bang?thuonghieu=huawei" },
          ],
        },
      ],
    },
    {
      name: "Laptop",
      icon: <FaLaptop size={22} />,
      link: "/laptop",
      subcategories: [
        {
          name: "Thương hiệu",
          items: [
            { name: "MacBook", link: "/laptop?thuonghieu=macbook" },
            { name: "Dell", link: "/laptop?thuonghieu=dell" },
            { name: "HP", link: "/laptop/hp" },
            { name: "Lenovo", link: "/laptop?thuonghieu=lenovo" },
            { name: "Acer", link: "/laptop?thuonghieu=acer" },
          ],
        },
      ],
    },
    {
      name: "Tai nghe",
      icon: <FaHeadphonesAlt size={22} />,
      link: "/tai-nghe",
      subcategories: [
        {
          name: "Hãng tai nghe",
          items: [
            { name: "Apple", link: "/tai-nghe?thuonghieu=apple" },
            { name: "Sony", link: "/tai-nghe?thuonghieu=sony" },
            { name: "JBL", link: "/tai-nghe?thuonghieu=jbl" },
            { name: "Huawai", link: "/tai-nghe?thuonghieu=huawei" },
            { name: "Xiaomi", link: "/tai-nghe?thuonghieu=xiaomi" },
          ],
        },
      ],
    },
    {
      name: "Đồng hồ",
      icon: <BsWatch size={22} />,
      link: "/dong-ho",
    },
    {
      name: "Màn hình",
      icon: <TbDeviceDesktop size={22} />,
      link: "/man-hinh",
    },
  ];

  return (
    <div className="relative" onMouseLeave={() => setHoveredCategory(null)}>
      {/* Sidebar (300px) */}
      <div className="relative z-10 w-[300px] bg-white border shadow-md rounded-lg text-neutral-700">
        {categories.map((category, index) => (
          <Link
            href={category.link}
            key={index}
            className="flex items-center justify-between p-4 cursor-pointer transition duration-300 hover:text-red-600"
            onMouseEnter={() => setHoveredCategory(category.name)} // Hiển thị subcategories
          >
            <div className="flex items-center gap-4">
              {category.icon}
              <span>{category.name}</span>
            </div>
            {category.subcategories !== undefined && <FaChevronRight />}
          </Link>
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
