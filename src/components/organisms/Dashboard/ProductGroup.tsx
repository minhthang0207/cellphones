import Link from "next/link";
import Loading from "../Loading";
import ProductGrid from "./ProductGrid";
import Image from "next/image";
import { FaLaptop } from "react-icons/fa6"; // Đổi icon tuỳ theo label

interface ProductGroupProps {
  label: string;
  linkAll: string;
  isLoading: boolean;
  listBrand: { title: string; link: string }[];
  product: Product[];
  bannerUrl?: string; // Thêm prop để truyền ảnh banner (tuỳ chọn)
  isHot?: boolean; // Tùy chọn: Chỉ truyền true nếu danh mục này đang sale mạnh
}

const ProductGroup = ({
  label,
  linkAll,
  isLoading,
  listBrand,
  product,
  bannerUrl,
  isHot = true,
}: ProductGroupProps) => {
  return (
    <div className="mt-8 md:mt-12 w-full bg-[#f5f5f5] p-4 md:p-6 lg:p-8 rounded-2xl">
      {/* 1. KHU VỰC BANNER (Chỉ hiện khi có truyền bannerUrl) */}
      {bannerUrl && (
        <div className="w-full mb-8 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white">
          <div className="relative w-full h-[150px] md:h-[200px] lg:h-[250px]">
            <Image
              src={bannerUrl}
              alt={`Khuyến mãi ${label}`}
              fill
              className="object-contain p-2"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            />
          </div>
        </div>
      )}

      {/* 2. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <h2 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-gray-800 flex items-center gap-3">
            <FaLaptop className="text-gray-400 text-2xl hidden sm:block" />

            {label}

            {/* Badge HOT: Chỉ hiển thị khi bạn truyền isHot={true} */}
            {isHot && (
              <span className="text-white text-[11px] md:text-xs font-bold bg-gradient-to-r from-[#d70018] to-orange-500 px-2 py-0.5 rounded-br-lg rounded-tl-lg shadow-sm relative -top-1">
                HOT
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          {/* Nhóm Filter */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 md:pb-0">
            {listBrand.map((item, index) => {
              return (
                <Link
                  href={item.link}
                  key={index}
                  className="whitespace-nowrap border border-gray-200 bg-white rounded-full px-4 py-1.5 text-sm font-semibold text-gray-600 hover:text-[#d70018] hover:border-[#d70018] hover:bg-red-50 transition-all duration-300 shadow-sm"
                >
                  {item.title}
                </Link>
              );
            })}
          </div>

          {/* Nút Xem tất cả */}
          <Link
            href={`${linkAll}`}
            className="hidden md:flex whitespace-nowrap text-sm font-medium text-blue-600 hover:text-[#d70018] transition-colors items-center gap-1"
          >
            Xem tất cả &rsaquo;
          </Link>
        </div>
      </div>

      {/* 3. CONTENT */}
      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center">
          <Loading fullWeb={false} />
        </div>
      ) : (
        <ProductGrid products={product} />
      )}
    </div>
  );
};

export default ProductGroup;
