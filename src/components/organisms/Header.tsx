import Image from "next/image";
import { Input } from "../ui/input";
import { CiSearch } from "react-icons/ci";
import { FaTimes, FaHome, FaBox, FaChevronDown, FaHeart, FaUserCircle } from "react-icons/fa";
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
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [isListVisible, setIsListVisible] = useState(false); // Trạng thái hiển thị danh sách
  const searchRef = useRef<HTMLDivElement | null>(null); // Tham chiếu đến container tìm kiếm
  const [isLoading, setIsLoading] = useState(false); // Trạng thái hiển thị danh sách
  const [listSearchProduct, setListSearchProduct] = useState<Product[]>([]);

  const router = useRouter();
  const handleToUserPage = () => {
    router.push("/lich-su-mua-hang");
  };

  const handleMobileClick = (href: string) => {
    setOpenSidebar(false);
    router.push(href);
  }

  const handleChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchName(value || "");
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
      <div className="h-[64px] w-full max-w-screen-xl grid grid-cols-[1fr_2fr_1fr] md:grid-cols-[300px_1fr_auto] items-centers justify-between px-4 xl:px-0 ">
        <button className="flex md:hidden items-center text-white cursor-pointer"
          onClick={() => setOpenSidebar(true)}
        >
          <FaBars size={20} />
        </button>
        <Link href="/" className="flex items-center md:w-[300px] justify-center w-full">
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
        {/* search */}
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
        <div className="flex justify-end md:gap-2 md:ml-4 ">
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
            className="hidden sm:flex items-center relative px-4 md:px-2 my-2 rounded-md transition duration-300 hover:bg-primary-500 text-white text-base"
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
              className="items-center justify-center ml-2 hidden sm:flex "
              onClick={() => handleToUserPage()}
            >
              <Avatar>
                <AvatarImage src={user.avatar} className="object-cover" />
                {/* "https://github.com/shadcn.png" */}
                <AvatarFallback></AvatarFallback>
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
      <div
          className="md:hidden flex items-center w-full px-3 py-2"
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

      {/* Overlay */}
      <div
        onClick={() => setOpenSidebar(false)}
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          openSidebar ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}
      
      <div
        className={`fixed py-4 px-4 transition-transform transfrom duration-300 top-0 left-0 w-[100%] sm:w-[70%] h-full z-50 bg-white ${openSidebar ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close button */}
        <div className="absolute top-4 right-4" onClick={() => setOpenSidebar(false)}>
          <FaTimes size={24} className="opacity-60 hover:opacity-80 transform transition duration-100 cursor-pointer" />
        </div>

        <Image src="/logo_small.jpg" alt="Logo" width={50} height={50}/>

        {/* Menu */}
        <ul className="px-4 py-6 space-y-2 text-gray-700">
          {/* Home */}
          <li className="flex items-center gap-3 rounded-md hover:bg-gray-100 cursor-pointer">
            <div className="flex items-center gap-3 p-2 w-full" onClick={() => handleMobileClick("/")}>
              <FaHome /> <span>Trang chủ</span>
            </div>
          </li>

          {/* Products + Submenu */}
          <li className="rounded-md hover:bg-gray-100 cursor-pointer">
            <button
              onClick={() => setOpenProducts(!openProducts)}
              className="flex items-center justify-between w-full h-full p-2"
            >
              <span className="flex items-center gap-3">
                <FaBox /> Danh mục sản phẩm
              </span>
              <FaChevronDown
                className={`transition-transform duration-200 ${
                  openProducts ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Submenu */}
            <ul
              className={`ml-8 space-y-2 text-gray-600 text-sm transition-all duration-300 overflow-hidden ${
                openProducts ? "max-h-40" : "max-h-0"
              }`}
            >
              
              <li className="hover:bg-gray-100 rounded-md cursor-pointer">
                <div onClick={() => handleMobileClick("/laptop")} className="flex items-center gap-3 w-full p-2">
                  💻 Máy tính
                </div>
              </li>
              <li className="hover:bg-gray-100 rounded-md cursor-pointer">
                <div onClick={() => handleMobileClick("/dien-thoai")} className="flex items-center gap-3 w-full p-2">
                  📱 Điện thoại
                </div>
              </li>
              <li className="hover:bg-gray-100 rounded-md cursor-pointer">
                <div onClick={() => handleMobileClick("/may-tinh-bang")} className="flex items-center gap-3 w-full p-2">
                  📟 Máy tính bảng
                </div>
              </li>
            </ul>
          </li>

          {/* Yêu thích */}
          <li className="flex items-center gap-3 rounded-md hover:bg-gray-100 cursor-pointer">
            <div className="flex items-center gap-3 w-full h-full p-2" onClick={() => handleMobileClick("/yeu-thich")}>
              <FaHeart /> <span>Yêu thích</span>
            </div>
          </li>

          {/* Acccount */}
          <li className="flex items-center gap-3 rounded-md hover:bg-gray-100 cursor-pointer">
            <div className="flex items-center gap-3 w-full h-full p-2"
              onClick={() => {
                if(Object.keys(user).length === 0) {
                  setOpenSidebar(false);
                  const redirectUrl = encodeURIComponent("/lich-su-mua-hang/thong-tin-nguoi-dung");
                  router.push(`/login?redirect=${redirectUrl}`);
                  return;
                }
                handleMobileClick("/lich-su-mua-hang")
              }}>
              <FaUserCircle /> <span>Tài khoản</span>
            </div>
          </li>
        </ul>
      </div>
      
      
    </div>
    
  );
};

export default Header;
