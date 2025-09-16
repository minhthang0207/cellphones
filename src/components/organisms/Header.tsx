import Image from "next/image";
import { Input } from "../ui/input";
import { CiSearch } from "react-icons/ci";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FaRegUser, FaRegHeart, FaBars } from "react-icons/fa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IoCartOutline } from "react-icons/io5";
import Link from "next/link";
import { useUserStore } from "@/store/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cart";
import useWishlistStore from "@/store/wishlist";
import { useEffect, useRef, useState } from "react";
import ListProductSearch from "./Dashboard/ListProductSearch";
import { getProductByName } from "@/libStatistic";

const Header: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const cart = useCartStore((state) => state.cart);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const [searchName, setSearchName] = useState("");
  const [isListVisible, setIsListVisible] = useState(false); // Trạng thái hiển thị danh sách
  const searchRef = useRef<HTMLDivElement | null>(null); // Tham chiếu đến container tìm kiếm
  const [isLoading, setIsLoading] = useState(false); // Trạng thái hiển thị danh sách
  const [listSearchProduct, setListSearchProduct] = useState<Product[]>([]);

  const router = useRouter();
  const handleToUserPage = () => {
    router.push("/lich-su-mua-hang");
  };

  const handleChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchName(value);
    setIsListVisible(value.trim().length > 0);
  };

  const handleClickOutside = (e: MouseEvent) => {
    // Nếu click bên ngoài thành phần
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setIsListVisible(false); // Ẩn danh sách
    }
  };

  useEffect(() => {
    // Thêm sự kiện khi component được mount
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Dọn dẹp sự kiện khi component bị unmount
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchName) {
      setIsLoading(true);

      const timer = setTimeout(async () => {
        const result = await getProductByName(searchName); // Gọi API hoặc logic cập nhật giỏ hàng
        if (result.success) {
          console.log(result.data);
          setListSearchProduct(result.data.products);
        } else {
          setListSearchProduct([]);
        }
        setIsLoading(false);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [searchName]); // Thêm dependency item.id và updateCart

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
            style={{
              width: "auto",
              height: "auto",
            }}
          />
        </Link>
        <div
          className="relative z-50 hidden md:flex items-center ml-3 mr-6"
          ref={searchRef}
        >
          <Input
            value={searchName}
            placeholder="Tìm kiếm sản phẩm"
            icon={<CiSearch size={24} />}
            className=""
            onChange={(e) => handleChangeSearchInput(e)}
          />
          {isListVisible && (
            <ListProductSearch
              products={listSearchProduct}
              isLoading={isLoading}
            />
          )}
        </div>
        <div className="flex justify-end md:gap-2 ml-4 ">
          {/* <div className="hidden md:flex gap-2 items-center px-2 my-2 rounded-md transition duration-300 hover:bg-primary-500 text-white text-base cursor-pointer">
            <MdOutlineLocalShipping size={24} />
            <span className="text-xs">
              Tra cứu <br /> đơn hàng
            </span>
          </div> */}

          <Link
            href="/gio-hang"
            className="flex items-center relative px-4 md:px-2 my-2 md:my-2 rounded-md transition duration-300 hover:bg-primary-500 text-white text-base"
          >
            <div className="relative cursor-pointer">
              <IoCartOutline size={24} />
              {Object.keys(user).length > 0 && (
                <span className="absolute flex justify-center items-center top-[-6px] right-[-10px] w-4 h-4 rounded-full bg-white text-primary-main text-[10px]">
                  {cart.length}
                </span>
              )}
            </div>
          </Link>
          <Link
            href="/yeu-thich"
            className="flex items-center relative px-4 md:px-2 my-2 rounded-md transition duration-300 hover:bg-primary-500 text-white text-base"
          >
            <div className="relative cursor-pointer">
              <FaRegHeart size={20} />
              {Object.keys(user).length > 0 && (
                <span className="absolute flex justify-center items-center top-[-6px] right-[-10px] w-4 h-4 rounded-full bg-white text-primary-main text-[10px]">
                  {wishlist.length}
                </span>
              )}
            </div>
          </Link>

          {Object.keys(user).length > 0 ? (
            <button
              type="button"
              className="flex items-center justify-center ml-2"
              onClick={() => handleToUserPage()}
            >
              <Avatar>
                <AvatarImage src={user.avatar} className="object-cover" />
                {/* "https://github.com/shadcn.png" */}
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden md:flex gap-2 items-center px-2 my-2 rounded-md transition duration-300 hover:bg-primary-500 text-white text-base cursor-pointer"
            >
              <FaRegUser />
              <span className="text-xs">Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
      <div className="md:hidden flex items-center w-full px-3 py-2">
        <Input
          placeholder="Tìm kiếm sản phẩm"
          className=""
          icon={<CiSearch size={24} />}
        />
      </div>
    </div>
  );
};

export default Header;
