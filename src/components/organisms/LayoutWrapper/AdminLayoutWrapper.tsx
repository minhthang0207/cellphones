"use client";
import HeaderAdmin from "../HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin";
import { IoIosHome, IoMdContact } from "react-icons/io";
import { FaInbox } from "react-icons/fa";
import { LuPackageSearch, LuSheet } from "react-icons/lu";
import { CiLogout, CiViewList } from "react-icons/ci";
import { BiCategory } from "react-icons/bi";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "@/store/user";
import { getUser } from "@/lib";
import Cookies from "js-cookie";
import { User } from "@/types/user";
// import useWishlistStore from "@/store/wishlist";

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
        label: "Đơn hàng",
        url: "/dashboard-admin/don-hang",
        icon: <CiViewList size={20} />,
      },

      {
        label: "Tin nhắn",
        url: "/dashboard-admin/tin-nhan",
        icon: <FaInbox size={20} />,
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

  const handleLogout = () => {
    Cookies.remove("session");
    addUser({} as User);
    router.push("/");
  };

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
        <button
          type="button"
          className="w-fit mx-auto mt-8 flex justify-center mb-4 rounded-lg items-center gap-2  p-2 text-red-500 border border-red-400 hover:text-white hover:bg-red-400 transition duration-300"
          onClick={() => handleLogout()}
        >
          <CiLogout size={20} /> Đăng xuất
        </button>
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
