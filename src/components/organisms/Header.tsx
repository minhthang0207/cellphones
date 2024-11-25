import Image from "next/image";
import { Input } from "../ui/input";
import { CiSearch } from "react-icons/ci";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FaRegUser, FaRegHeart, FaBars } from "react-icons/fa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MdOutlineLocalShipping } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-primary-main sticky top-0 z-50">
      <div className="h-[64px] w-full max-w-screen-xl grid grid-cols-3 md:grid-cols-[300px_1fr_auto]  items-centers justify-between px-3 md:px-0">
        <button className="flex md:hidden items-center text-white">
          <FaBars size={24} />
        </button>
        <Link href="/" className="flex items-center w-fit md:w-[300px]">
          <Image
            src="/logo.png"
            width={180}
            height={30}
            alt="logo cellphoneS"
          />
        </Link>
        <div className="hidden md:flex items-center ml-3">
          <Input
            placeholder="Tìm kiếm sản phẩm"
            icon={<CiSearch size={24} />}
            className=""
          />
        </div>
        <div className="flex justify-end md:gap-2 ml-4 ">
          <div className="hidden md:flex gap-2 items-center px-2 my-2 rounded-md transition duration-300 hover:bg-primary-500 text-white text-base cursor-pointer">
            <MdOutlineLocalShipping size={24} />
            <span className="text-xs">
              Tra cứu <br /> đơn hàng
            </span>
          </div>
          {/* <div className="flex gap-2 items-center px-2 my-2 rounded-md transition duration-300 hover:bg-primary-500 text-white text-base cursor-pointer">
            <IoCartOutline size={24} />
            <span className="text-xs">
              Giỏ <br /> hàng
            </span>
          </div> */}
          <Link
            href="/login"
            className="hidden md:flex gap-2 items-center px-2 my-2 rounded-md transition duration-300 hover:bg-primary-500 text-white text-base cursor-pointer"
          >
            <FaRegUser />
            <span className="text-xs">Đăng nhập</span>
          </Link>
          <div className="flex items-center relative px-4 md:px-2 my-2 md:my-2 rounded-md transition duration-300 hover:bg-primary-500 text-white text-base">
            <div className="relative cursor-pointer">
              <IoCartOutline size={24} />
              <span className="absolute flex justify-center items-center top-[-6px] right-[-10px] w-4 h-4 rounded-full bg-white text-primary-main text-[10px]">
                99
              </span>
            </div>
          </div>
          <div className="flex items-center relative px-4 md:px-2 my-2 rounded-md transition duration-300 hover:bg-primary-500 text-white text-base">
            <div className="relative cursor-pointer">
              <FaRegHeart size={20} />
              <span className="absolute flex justify-center items-center top-[-6px] right-[-10px] w-4 h-4 rounded-full bg-white text-primary-main text-[10px]">
                1
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden flex items-center w-full px-3 py-2">
        <Input placeholder="Tìm kiếm sản phẩm" icon={<CiSearch size={24} />} />
      </div>
    </div>
  );
};

export default Header;
