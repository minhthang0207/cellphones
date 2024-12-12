"use client";
import HeaderAdmin from "../HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin";
import { IoIosHome, IoMdSettings, IoMdContact } from "react-icons/io";
import { FaCalendar, FaInbox, FaSearch, FaChartBar } from "react-icons/fa";
import { LuPackageSearch, LuSheet } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";
import { BiCategory } from "react-icons/bi";

const menuItems = [
  {
    title: "Chức năng",
    items: [
      {
        label: "Trang chủ",
        url: "/dashboard-admin",
        icon: <IoIosHome size={20} />,
      },

      {
        label: "Sản phẩm",
        url: "/products",
        icon: <LuPackageSearch size={20} />,
      },
      {
        label: "Loại sản phẩm",
        url: "/product-category",
        icon: <BiCategory size={20} />,
      },
      {
        label: "Thuộc tính",
        url: "/attributes",
        icon: <LuSheet size={20} />,
      },
      {
        label: "Nhân viên",
        url: "/customers",
        icon: <IoMdContact size={20} />,
      },

      {
        label: "Tin nhắn",
        url: "/inboxs",
        icon: <FaInbox size={20} />,
      },
      {
        label: "Thống kê",
        url: "/statistics",
        icon: <FaChartBar size={20} />,
      },
    ],
  },
  {
    title: "Khác",
    items: [
      {
        label: "Calendar",
        url: "#",
        icon: <FaCalendar size={20} />,
      },
      {
        label: "Search",
        url: "#",
        icon: <FaSearch size={20} />,
      },
      {
        label: "Settings",
        url: "/setting",
        icon: <IoMdSettings size={20} />,
      },
      {
        label: "Đăng xuất",
        url: "/logout",
        icon: <CiLogout size={20} />,
      },
    ],
  },
];
const AdminLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-neutral-100">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%]  xl:w-[14%] p-4 bg-white">
        <SidebarAdmin menuItems={menuItems} />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-neutral-100 overflow-y-scroll">
        <HeaderAdmin />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayoutWrapper;
