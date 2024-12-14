"use client";

import { useUserStore } from "@/store/user";
import "moment/locale/vi";
import { AiOutlineMessage } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const HeaderAdmin: React.FC = () => {
  const user = useUserStore((state) => state.user);
  return (
    <div className="bg-white w-full h-[64px] bg-red flex justify-between items-center border border-b shadow-md p-4">
      {/* Search */}
      <div className="bg-white hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-neutral-300 px-2">
        <FaSearch size={16} className="text-neutral-500" />
        <input
          type="text"
          placeholder="Tìm kiếm"
          className="bg-transparent p-2 outline-none w-[200px]"
        />
      </div>
      {/* message and logo */}
      <div className="flex items-center gap-8 ">
        {/* message */}
        <div className="bg-white  rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <AiOutlineMessage size={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-red-400 text-white rounded-full text-xs">
            1
          </div>
        </div>
        {/* logo user */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-base font-semibold text-neutral-700 text-right">
              {user.name}
            </span>
            <span className="text-sm font-semibold text-neutral-400 text-right">
              {user.role}
            </span>
          </div>
          <Avatar>
            <AvatarImage src={user.avatar} className="object-cover" />
            {/* "https://github.com/shadcn.png" */}
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
