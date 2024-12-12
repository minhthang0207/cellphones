"use client";
import { CiLogout } from "react-icons/ci";
import { FaRegFileLines, FaHouseUser } from "react-icons/fa6";
import SidebarAdmin from "@/components/organisms/SidebarAdmin";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import Cookies from "js-cookie";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const addUser = useUserStore((state) => state.addUser);
  const handleLogout = () => {
    Cookies.remove("session");
    addUser({} as User);
    router.push("/");
  };
  return (
    <div className=" flex justify-center mx-auto w-full max-w-[1280px] h-fit">
      {/* left */}
      <div className="border-r pr-4 bg-white">
        <div className="h-full flex flex-col gap-8">
          <SidebarAdmin menuItems={menuItems} isUserInfoPage={true} />
          <button
            type="button"
            className="flex justify-center mb-4 rounded-lg items-center gap-2  p-2 text-red-500 border border-red-400 hover:text-white hover:bg-red-400 transition duration-300"
            onClick={() => handleLogout()}
          >
            <CiLogout size={20} /> Đăng xuất
          </button>
        </div>
      </div>
      {/* right */}
      <section className="flex-1 mt-6 pl-4 h-fit">{children}</section>
    </div>
  );
}

const menuItems = [
  {
    title: "NGƯỜI DÙNG",
    items: [
      {
        label: "Đơn hàng đã mua",
        url: "/lich-su-mua-hang",
        icon: <FaRegFileLines size={20} />,
      },

      {
        label: "Thông tin người dùng",
        url: "/lich-su-mua-hang/thong-tin-nguoi-dung",
        icon: <FaHouseUser size={20} />,
      },
    ],
  },
];
