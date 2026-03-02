import { useState } from "react";
import Link from "next/link";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { FaChevronRight, FaLaptop, FaTabletAlt } from "react-icons/fa";
// Đừng quên import các icon của bạn vào đây: IoPhonePortraitOutline, FaChevronRight...

const Sidebar = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Mở rộng data structure để hỗ trợ Mega Menu nhiều cột
  const categories = [
    {
      name: "Điện thoại",
      icon: <IoPhonePortraitOutline size={20} />,
      link: "/dien-thoai",
      subcategories: [
        {
          title: "Thương hiệu",
          items: [
            { name: "iPhone", link: "/dien-thoai?brand=apple" },
            { name: "Samsung", link: "/dien-thoai?brand=samsung" },
            { name: "Xiaomi", link: "/dien-thoai?brand=xiaomi" },
            { name: "OPPO", link: "/dien-thoai?brand=oppo" },
          ],
        },
        {
          title: "Mức giá",
          items: [
            { name: "Dưới 2 triệu", link: "/dien-thoai?price=under2" },
            { name: "Từ 2 - 4 triệu", link: "/dien-thoai?price=2-4" },
            { name: "Từ 4 - 7 triệu", link: "/dien-thoai?price=4-7" },
            { name: "Trên 13 triệu", link: "/dien-thoai?price=over13" },
          ],
        },
      ],
      // Thêm banner nhỏ bên trong Mega menu
      promoBanner:
        "https://static.minhtuanmobile.com/uploads/editer/2026-01/16/images/iphone-17-pro-max-2t-3.jpg", // Link ảnh giả lập
    },
    {
      name: "Máy tính bảng",
      icon: <FaTabletAlt size={20} />,
      link: "/may-tinh-bang",
      subcategories: [
        {
          title: "Thương hiệu",
          items: [
            { name: "iPad", link: "/may-tinh-bang?brand=ipad" },
            { name: "Samsung", link: "/may-tinh-bang?brand=samsung" },
            { name: "Xiaomi", link: "/may-tinh-bang?brand=xiaomi" },
          ],
        },
      ],
    },
    // Các mục khác
    {
      name: "Laptop",
      icon: <FaLaptop size={22} />,
      link: "/laptop",
      subcategories: [
        {
          title: "Thương hiệu",
          items: [
            { name: "MacBook", link: "/laptop?brand=apple" },
            { name: "Dell", link: "/laptop?brand=dell" },
            { name: "HP", link: "/laptop/?brand=hp" },
            { name: "Lenovo", link: "/laptop?brand=lenovo" },
            { name: "Acer", link: "/laptop?brand=acer" },
            { name: "Asus", link: "/laptop?brand=asus" },
          ],
        },
      ],
    },
    // {
    //   name: "Tai nghe",
    //   icon: <FaHeadphonesAlt size={22} />,
    //   link: "/tai-nghe",
    //   subcategories: [
    //     {
    //       name: "Hãng tai nghe",
    //       items: [
    //         { name: "Apple", link: "/tai-nghe?thuonghieu=apple" },
    //         { name: "Sony", link: "/tai-nghe?thuonghieu=sony" },
    //         { name: "JBL", link: "/tai-nghe?thuonghieu=jbl" },
    //         { name: "Huawai", link: "/tai-nghe?thuonghieu=huawei" },
    //         { name: "Xiaomi", link: "/tai-nghe?thuonghieu=xiaomi" },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   name: "Đồng hồ",
    //   icon: <BsWatch size={22} />,
    //   link: "/dong-ho",
    // },
    // {
    //   name: "Màn hình",
    //   icon: <TbDeviceDesktop size={22} />,
    //   link: "/man-hinh",
    // },
  ];

  return (
    <div
      className="relative h-full"
      onMouseLeave={() => setHoveredCategory(null)}
    >
      {/* Cột Menu chính (280px) */}
      <div className="relative z-20 w-[280px] h-[380px] bg-white border shadow-sm rounded-md py-2 flex flex-col justify-between text-sm font-medium text-gray-700">
        <div className="flex-1 flex flex-col">
          {categories.map((category, index) => {
            const isHovered = hoveredCategory === category.name;
            return (
              <Link
                href={category.link}
                key={index}
                className={`flex items-center justify-between px-4 py-2.5 mx-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  isHovered ? "bg-red-50 text-red-600" : "hover:bg-gray-50"
                }`}
                onMouseEnter={() => setHoveredCategory(category.name)}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={isHovered ? "text-red-600" : "text-gray-500"}
                  >
                    {category.icon}
                  </span>
                  <span>{category.name}</span>
                </div>
                {category.subcategories && (
                  <FaChevronRight
                    size={12}
                    className={isHovered ? "text-red-600" : "text-gray-400"}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mega Menu Popup (Content hover) */}
      {categories.map(
        (category, index) =>
          hoveredCategory === category.name &&
          category.subcategories && (
            <div
              key={index}
              className="absolute top-0 left-[278px] min-h-[380px] min-w-[600px] z-50 bg-white border shadow-xl rounded-md ml-2  animate-in fade-in zoom-in-95 duration-200"
            >
              {/* 2. CẦU NỐI TÀNG HÌNH (INVISIBLE BRIDGE): */}
              {/* Đây là mấu chốt: Một khối trong suốt thò ra bên trái 16px (-left-4) để hứng con trỏ chuột khi di chuyển chéo */}
              <div className="absolute top-0 -left-4 w-4 h-full  cursor-default bg-transparent" />
              <div className="p-6 flex gap-10">
                {/* Phần chứa danh sách cột (Thương hiệu, Giá...) */}
                <div className="flex gap-12 flex-1">
                  {category.subcategories.map((col, colIndex) => (
                    <div key={colIndex} className="min-w-[120px]">
                      <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                        {col.title}
                      </h3>
                      <ul className="flex flex-col gap-2.5">
                        {col.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <Link
                              href={item.link}
                              className="text-sm text-gray-600 hover:text-red-600 transition-colors block"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Phần chứa Banner Quảng cáo (Nếu có) */}
                {category.promoBanner && (
                  <div className="w-[200px] shrink-0 rounded-md overflow-hidden border">
                    <div className="relative w-full h-full min-h-[200px] bg-gray-100 flex items-center justify-center">
                      {/* Bạn thay bằng thẻ Image của Next.js nhé */}
                      <img
                        src={category.promoBanner}
                        alt="Promo"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-md text-center">
                        <p className="text-xs font-bold text-red-600">
                          Ưu đãi hôm nay
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ),
      )}
    </div>
  );
};

export default Sidebar;
