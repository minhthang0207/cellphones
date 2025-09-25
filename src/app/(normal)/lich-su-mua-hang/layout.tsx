"use client";
import { CiLogout } from "react-icons/ci";
import { FaRegFileLines, FaHouseUser } from "react-icons/fa6";
import SidebarAdmin from "@/components/organisms/SidebarAdmin";
import { useUserStore } from "@/store/user";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { FaUserCircle } from "react-icons/fa";
import { IoReceiptOutline } from "react-icons/io5";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logout = useUserStore((state) => state.logout)
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = () => {
    logout();
    router.push("/");
  };
  return (
    <div className="relative md:flex md:justify-center mx-auto w-full max-w-[1280px] h-fit">
      {/* left */}
      <div className="border-r pr-4 bg-white hidden md:block">
        <div className="h-full flex flex-col gap-8 ">
          <SidebarAdmin
            menuItems={menuItems}
            isUserInfoPage={true}
            isSticky={false}
          />
          <button
            type="button"
            className="flex justify-center mb-4 rounded-lg items-center gap-2 ml-2 p-2 text-red-500 border border-red-400 hover:text-white hover:bg-red-400 transition duration-300"
            onClick={() => handleLogout()}
          >
            <CiLogout size={20} /> Đăng xuất
          </button>
        </div>
      </div>
      {/* right */}
      <section className="flex-1 my-6 pl-4 h-fit">{children}</section>

      {/* tabbar bottom on mobile */}
      <div className="sticky md:hidden bottom-0 left-0 w-full h-fit">
        <div className="bg-white py-2 grid grid-cols-2 rounded-tl-3xl rounded-tr-3xl shadow-2xl border">
          {navItems.map(({ href, label, icon: Icon }, index) => {
            const isActive = pathname === href;
            return (
              <Link key={index} href={href} className="relative flex flex-col gap-1 justify-center items-center text-xs text-ne`utral-500">
                {isActive && (
                  <span className="absolute -top-2 w-8 h-1 bg-red-600 rounded-bl-full rounded-br-full"></span>
                )}
                <Icon size={16} className={`w-5 h-5 ${isActive ? "text-red-600" : "text-neutral-500"}`}/>
                <span className={`${isActive ? "text-red-600" : "text-neutral-500"}`}>{label}</span>
              </Link>
            )
          })}
          
        </div>

      </div>
    </div>
    
  );
}

const navItems = [
  { 
    href: "/lich-su-mua-hang",
    label: "Lịch sử",
    icon: IoReceiptOutline,
  },
  { 
    href: "/lich-su-mua-hang/thong-tin-nguoi-dung",
    label: "Tài khoản",
    icon: FaUserCircle,
  }
]

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
