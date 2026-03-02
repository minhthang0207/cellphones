import CardProduct from "@/components/ui/cardProduct";
import { FaFireAlt, FaChevronRight } from "react-icons/fa"; // Import thêm icon
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import Link from "next/link"; // Import Link

interface OutStandingProductProps {
  products: Product[];
  isLoading?: boolean;
}

const OutStandingProduct: React.FC<OutStandingProductProps> = ({
  products,
  isLoading,
}) => {
  const [windowWidth, setWindowWidth] = useState(0);

  // Cập nhật windowWidth khi kích thước màn hình thay đổi
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // Set initial width
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize); // Cleanup listener
  }, []);

  // Xác định số lượng sản phẩm cần hiển thị tùy thuộc vào kích thước màn hình
  const getItemsToShow = () => {
    if (windowWidth < 768) {
      return 4; // Nếu màn hình nhỏ (mobile), chỉ slice 4 sản phẩm
    } else if (windowWidth >= 768 && windowWidth < 1024) {
      return 6; // Nếu màn hình trung bình (tablet), slice 6 sản phẩm
    } else {
      return 10; // Nếu màn hình lớn (desktop), slice 10 sản phẩm
    }
  };
  const itemsPerPage = getItemsToShow();

  return (
    // 1. ÁP DỤNG NỀN GRADIENT (Từ đỏ rực -> Đỏ nhạt -> Trắng)
    <div className="w-full bg-gradient-to-b from-[#d70018] via-red-50 to-white rounded-2xl p-4 md:p-6 shadow-sm border border-red-100 mt-8">
      {/* 2. HEADER MỚI: Sang trọng và tạo cảm giác Flash Sale */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-wider drop-shadow-md flex items-center gap-2">
            <FaFireAlt className="text-yellow-300" /> SẢN PHẨM NỔI BẬT
          </h3>

          {/* Đồng hồ đếm ngược (Giả lập) */}
          <div className="hidden sm:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
            <span className="text-sm font-medium text-white">
              Kết thúc trong:
            </span>
            <div className="flex gap-1 text-sm font-bold">
              <span className="bg-black text-white px-2 py-0.5 rounded-md shadow">
                02
              </span>
              <span className="text-white">:</span>
              <span className="bg-black text-white px-2 py-0.5 rounded-md shadow">
                15
              </span>
              <span className="text-white">:</span>
              <span className="bg-black text-white px-2 py-0.5 rounded-md shadow">
                45
              </span>
            </div>
          </div>
        </div>

        {/* Nút Xem tất cả */}
        <Link
          href="/san-pham-hot"
          className="text-white bg-white/20 hover:bg-white hover:text-[#d70018] transition-all duration-300 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 w-fit"
        >
          Xem tất cả <FaChevronRight size={12} />
        </Link>
      </div>

      {/* 3. KHU VỰC SẢN PHẨM */}
      {isLoading ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl h-[400px] flex items-center justify-center">
          <Loading fullWeb={false} />
        </div>
      ) : (
        <Carousel
          className="w-full relative"
          opts={{
            loop: false,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4 py-4">
            {Array.from({
              length: Math.ceil(products.length / itemsPerPage),
            }).map((_, pageIndex) => (
              <CarouselItem key={pageIndex} className="pl-2 md:pl-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                  {products
                    .slice(
                      pageIndex * itemsPerPage,
                      (pageIndex + 1) * itemsPerPage,
                    )
                    .map((item, index) => (
                      <CardProduct product={item} key={index} />
                    ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* điều hướng */}
          <CarouselPrevious className="absolute left-0 md:-left-5 bg-white border-gray-200 shadow-md hover:bg-gray-50 text-gray-700" />
          <CarouselNext className="absolute right-0 md:-right-5 bg-white border-gray-200 shadow-md hover:bg-gray-50 text-gray-700" />
        </Carousel>
      )}
    </div>
  );
};

export default OutStandingProduct;
