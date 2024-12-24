"use client";
import HeaderAdmin from "../HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin";
import { IoIosHome, IoMdSettings, IoMdContact } from "react-icons/io";
import { FaCalendar, FaInbox, FaSearch, FaChartBar } from "react-icons/fa";
import { LuPackageSearch, LuSheet } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";
import { BiCategory } from "react-icons/bi";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "@/store/user";
import { getUser } from "@/lib";

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
        url: "/dashboard-admin/san-pham",
        icon: <LuPackageSearch size={20} />,
      },
      {
        label: "Loại sản phẩm",
        url: "/dashboard-admin/loai-san-pham",
        icon: <BiCategory size={20} />,
      },
      {
        label: "Thuộc tính",
        url: "/dashboard-admin/thuoc-tinh",
        icon: <LuSheet size={20} />,
      },
      {
        label: "Người dùng",
        url: "/dashboard-admin/nguoi-dung",
        icon: <IoMdContact size={20} />,
      },

      {
        label: "Tin nhắn",
        url: "/dashboard-admin/tin-nhan",
        icon: <FaInbox size={20} />,
      },
      {
        label: "Thống kê",
        url: "/dashboard-admin/thong-ke",
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
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const user = useUserStore((state) => state.user);
  const addUser = useUserStore((state) => state.addUser);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const result = await getUser();
      if (result.success && result.data.user) {
        addUser(result.data.user);
      } else {
        router.push("/login");
      }
    };
    if (Object.keys(user).length === 0 && !isAuthPage) {
      fetchUserData();
    }

    if (Object.keys(user).length > 0 && user && !isAuthPage) {
      if (user.role !== "user" && user.role !== "admin") {
        router.push("/login");
      } else if (user.role === "user") {
        router.push("/");
      }
    }
  }, [user, isAuthPage, addUser, router]);
  return (
    <div className="flex w-full h-screen overflow-hidden bg-neutral-100">
      {/* LEFT */}
      <div className="w-fit bg-white overflow-auto custom-scrollbar flex-shrink-0 ">
        <SidebarAdmin menuItems={menuItems} />
      </div>
      {/* RIGHT */}
      <div className="w-full bg-neutral-100 overflow-y-scroll ">
        <HeaderAdmin />
        <main className="h-fit">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayoutWrapper;
