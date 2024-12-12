import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

// Menu items.

interface MenuItems {
  label: string;
  url: string;
  icon: ReactNode;
}

interface MenuSection {
  title: string;
  items: MenuItems[];
}

interface SidebarAdminProps {
  menuItems: MenuSection[];
  isUserInfoPage?: boolean;
}

const SidebarAdmin: React.FC<SidebarAdminProps> = ({
  menuItems,
  isUserInfoPage = false,
}) => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-4">
      {!isUserInfoPage && (
        <Link
          href="/dashboard-admin"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/logo_small.jpg" alt="logo" width={32} height={32} />
          <span className="hidden lg:block">CellPhoneS</span>
        </Link>
      )}
      <div>
        {menuItems.map((item) => {
          return (
            <div key={item.title} className="mt-6">
              <span className="block md:text-left mb-4 text-center text-neutral-400 font-light">
                {item.title}
              </span>
              <div className="flex flex-col gap-4 ml-0 items-center lg:items-start md:ml-1">
                {item.items.map((item) => {
                  return (
                    <Link
                      key={item.label}
                      href={item.url}
                      className={`w-full px-2 py-2 flex gap-2 items-center text-neutral-700 font-normal rounded-lg ease-in-out transition-all duration-300 ${
                        pathname === item.url && "bg-red-400 text-white"
                      } `}
                    >
                      {item.icon}
                      <span className="hidden lg:block ">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarAdmin;
