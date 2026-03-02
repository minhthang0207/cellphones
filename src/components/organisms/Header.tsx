import Image from "next/image";
import { Input } from "../ui/input";
import { CiSearch } from "react-icons/ci";
import {
  FaTimes,
  FaHome,
  FaBox,
  FaChevronDown,
  FaHeart,
  FaUserCircle,
} from "react-icons/fa";
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
  const [isListVisible, setIsListVisible] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [listSearchProduct, setListSearchProduct] = useState<Product[]>([]);

  // 1. THÊM STATE ĐỂ BẮT SỰ KIỆN CUỘN TRANG
  const [isScrolled, setIsScrolled] = useState(false);

  const router = useRouter();
  const handleToUserPage = () => {
    router.push("/lich-su-mua-hang");
  };

  const handleMobileClick = (href: string) => {
    setOpenSidebar(false);
    router.push(href);
  };

  const handleChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchName(value || "");
    setIsListVisible(value.trim().length > 0);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setIsListVisible(false);
    }
  };

  // 2. LẮNG NGHE SỰ KIỆN CUỘN
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20); // Nếu cuộn quá 20px thì bật hiệu ứng
    };
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchName) {
      setIsLoading(true);

      const timer = setTimeout(async () => {
        const result = await getProductByName(searchName);
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
  }, [searchName]);

  return (
    <div
      className={`flex flex-col justify-center items-center sticky top-0 z-[100] w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#d70018]/95 backdrop-blur-md shadow-md"
          : "bg-[#d70018]"
      }`}
    >
      {/* 1. WRAPPER */}
      <div
        className={`w-full max-w-screen-xl flex items-center justify-between px-4 xl:px-0 transition-all duration-300 gap-4 lg:gap-8 ${
          isScrolled ? "h-[56px]" : "h-[64px]"
        }`}
      >
        {/* Nút Menu Mobile */}
        <button
          className="flex md:hidden items-center text-white cursor-pointer shrink-0"
          onClick={() => setOpenSidebar(true)}
        >
          <FaBars size={20} />
        </button>

        {/* 2. LOGO*/}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            width={200}
            height={40}
            alt="logo cellphoneS"
            className={`transition-all duration-300 object-contain w-auto ${isScrolled ? "h-[28px] md:h-[30px]" : "h-[32px] md:h-[36px]"}`}
          />
        </Link>

        {/* 3. SEARCH (Desktop) */}
        <div
          className="relative z-50 hidden md:flex items-center flex-1 group"
          ref={searchRef}
        >
          <Input
            value={searchName}
            placeholder="Tìm kiếm sản phẩm"
            icon={
              <CiSearch
                size={24}
                className="text-gray-500 group-hover:text-[#d70018] transition-colors"
              />
            }
            className="shadow-inner w-full m-0"
            onChange={(e) => handleChangeSearchInput(e)}
          />
          {isListVisible && (
            <ListProductSearch
              products={listSearchProduct}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* 4. NHÓM NÚT (User, Cart, Wishlist) */}
        <div className="flex items-center justify-end md:gap-2 shrink-0 h-full">
          <Link
            href="/gio-hang"
            className="flex flex-col items-center justify-center relative px-3 py-1.5 rounded-lg transition-all duration-300 hover:bg-white/20 text-white"
          >
            <div className="relative flex flex-col items-center">
              <IoCartOutline size={22} className="mb-0.5" />
              <span className="text-[10px] hidden md:block font-medium leading-none mt-1">
                Giỏ hàng
              </span>
              {Object.keys(user).length > 0 && (
                <span className="absolute flex justify-center items-center top-[-8px] right-[-8px] w-4 h-4 rounded-full bg-white text-[#d70018] text-[10px] font-bold shadow-sm">
                  {cart.length}
                </span>
              )}
            </div>
          </Link>

          <Link
            href="/yeu-thich"
            className="hidden sm:flex flex-col items-center justify-center relative px-3 py-1.5 rounded-lg transition-all duration-300 hover:bg-white/20 text-white"
          >
            <div className="relative flex flex-col items-center">
              <FaRegHeart size={18} className="mb-0.5" />
              <span className="text-[10px] hidden md:block font-medium leading-none mt-1.5">
                Yêu thích
              </span>
              {Object.keys(user).length > 0 && (
                <span className="absolute flex justify-center items-center top-[-8px] right-[-8px] w-4 h-4 rounded-full bg-white text-[#d70018] text-[10px] font-bold shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </div>
          </Link>

          {Object.keys(user).length > 0 ? (
            <button
              type="button"
              className="flex items-center justify-center ml-2 hidden sm:flex hover:scale-105 transition-transform"
              onClick={() => handleToUserPage()}
            >
              <Avatar className="border border-white/30 h-8 w-8">
                <AvatarImage src={user.avatar} className="object-cover" />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden md:flex gap-2 items-center px-3 py-2 ml-2 rounded-lg transition-all duration-300 bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <FaRegUser size={16} />
              <span className="text-xs font-semibold whitespace-nowrap">
                Đăng nhập
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Search Mobile */}
      <div
        className={`md:hidden flex items-center w-full px-3 transition-all duration-300 ${
          isScrolled ? "pb-2 pt-0 h-[48px]" : "py-2 h-[56px]"
        }`}
      >
        <Input
          value={searchName}
          placeholder="Tìm kiếm sản phẩm"
          icon={<CiSearch size={24} />}
          className="shadow-inner"
          onChange={(e) => handleChangeSearchInput(e)}
        />
      </div>

      {/* SIDEBAR MOBILE */}
      <div
        onClick={() => setOpenSidebar(false)}
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          openSidebar ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <div
        className={`fixed py-4 px-4 transition-transform transfrom duration-300 top-0 left-0 w-[100%] sm:w-[70%] h-full z-50 bg-white shadow-2xl ${openSidebar ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className="absolute top-4 right-4"
          onClick={() => setOpenSidebar(false)}
        >
          <FaTimes
            size={24}
            className="opacity-60 hover:opacity-80 transform transition duration-100 cursor-pointer"
          />
        </div>

        <Image src="/logo_small.jpg" alt="Logo" width={50} height={50} />

        <ul className="px-4 py-6 space-y-2 text-gray-700">
          <li className="flex items-center gap-3 rounded-md hover:bg-red-50 hover:text-[#d70018] transition-colors cursor-pointer">
            <div
              className="flex items-center gap-3 p-2 w-full"
              onClick={() => handleMobileClick("/")}
            >
              <FaHome /> <span>Trang chủ</span>
            </div>
          </li>

          <li className="rounded-md hover:bg-gray-50 cursor-pointer">
            <button
              onClick={() => setOpenProducts(!openProducts)}
              className="flex items-center justify-between w-full h-full p-2 hover:text-[#d70018] transition-colors"
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

            <ul
              className={`ml-8 space-y-2 text-gray-600 text-sm transition-all duration-300 overflow-hidden ${
                openProducts ? "max-h-40 mt-2" : "max-h-0"
              }`}
            >
              <li className="hover:bg-red-50 hover:text-[#d70018] rounded-md cursor-pointer transition-colors">
                <div
                  onClick={() => handleMobileClick("/laptop")}
                  className="flex items-center gap-3 w-full p-2"
                >
                  💻 Máy tính
                </div>
              </li>
              <li className="hover:bg-red-50 hover:text-[#d70018] rounded-md cursor-pointer transition-colors">
                <div
                  onClick={() => handleMobileClick("/dien-thoai")}
                  className="flex items-center gap-3 w-full p-2"
                >
                  📱 Điện thoại
                </div>
              </li>
              <li className="hover:bg-red-50 hover:text-[#d70018] rounded-md cursor-pointer transition-colors">
                <div
                  onClick={() => handleMobileClick("/may-tinh-bang")}
                  className="flex items-center gap-3 w-full p-2"
                >
                  📟 Máy tính bảng
                </div>
              </li>
            </ul>
          </li>

          <li className="flex items-center gap-3 rounded-md hover:bg-red-50 hover:text-[#d70018] transition-colors cursor-pointer">
            <div
              className="flex items-center gap-3 w-full h-full p-2"
              onClick={() => handleMobileClick("/yeu-thich")}
            >
              <FaHeart /> <span>Yêu thích</span>
            </div>
          </li>

          <li className="flex items-center gap-3 rounded-md hover:bg-red-50 hover:text-[#d70018] transition-colors cursor-pointer">
            <div
              className="flex items-center gap-3 w-full h-full p-2"
              onClick={() => {
                if (Object.keys(user).length === 0) {
                  setOpenSidebar(false);
                  const redirectUrl = encodeURIComponent(
                    "/lich-su-mua-hang/thong-tin-nguoi-dung",
                  );
                  router.push(`/login?redirect=${redirectUrl}`);
                  return;
                }
                handleMobileClick("/lich-su-mua-hang");
              }}
            >
              <FaUserCircle /> <span>Tài khoản</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
