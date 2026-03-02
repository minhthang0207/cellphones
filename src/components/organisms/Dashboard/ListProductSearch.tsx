import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { FaChevronRight } from "react-icons/fa"; // Import thêm icon mũi tên

interface ListProductSearchProps {
  products: Product[];
  isLoading: boolean;
}

const ListProductSearch: React.FC<ListProductSearchProps> = ({
  products,
  isLoading,
}) => {
  return (
    <>
      {/* 1. CONTAINER */}
      <div className="z-[110] absolute top-full left-0 w-full max-h-[400px] border border-gray-100 rounded-md bg-white shadow-2xl overflow-y-auto custom-scrollbar mt-1">
        {isLoading ? (
          <div className="flex flex-col">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 p-3 border-b border-gray-50"
              >
                <Skeleton className="h-14 w-14 rounded-md shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="flex flex-col">
            {products.map((product, index) => {
              return (
                <Link
                  key={product.id}
                  href={`/${product.Product_Category?.slug}/${product?.slug}`}
                  // 1. ĐỔI NỀN HOVER:
                  className={`group flex gap-3 sm:gap-4 items-center p-3 hover:bg-gray-100 transition-colors duration-100 ${
                    index < products.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="w-14 h-14 shrink-0 bg-white border border-gray-100 rounded-md p-1 flex items-center justify-center">
                    <Image
                      alt={product.name}
                      src={product.image}
                      width={56}
                      height={56}
                      className="object-contain w-full h-full mix-blend-multiply"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    {/* 2. CHỮ TEXT: */}
                    <h4 className="text-sm font-medium text-gray-800 truncate transition-colors">
                      {product.name}
                    </h4>

                    <span className="text-sm text-[#d70018] font-bold mt-1">
                      {Number(product.price).toLocaleString("vi-VN")}
                      <sup className="ml-0.5">đ</sup>
                    </span>
                  </div>

                  {/* 3. MŨI TÊN */}
                  <div className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all duration-300 pl-2 shrink-0">
                    <FaChevronRight size={12} />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          // 7. TRẠNG THÁI TRỐNG"
          <div className="w-full text-center p-8 text-gray-500 flex flex-col items-center justify-center gap-2">
            <span className="text-3xl text-gray-300">🔍</span>
            <p className="text-sm">Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ListProductSearch;
