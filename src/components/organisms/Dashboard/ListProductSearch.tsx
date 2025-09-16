import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

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
      {/* <div className="fixed z-20 top-0 left-0 w-screen h-screen bg-neutral-500 opacity-30"></div> */}
      <div className="z-30 py-4 shadow-lg absolute top-full -mt-3 left-0 w-full min-h-[300px] h-fit max-h-[500px] border rounded-bl-md rounded-br-md  bg-white overflow-y-scroll custom-scrollbar">
        {isLoading ? (
          <>
            <div className="flex items-center gap-8 p-4">
              <Skeleton className="h-[60px] w-[60px] rounded-lg" />
              <div className="w-[70%]">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full mt-4" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-4 " />
              </div>
            </div>
            <div className="flex items-center gap-8 p-4">
              <Skeleton className="h-[60px] w-[60px] rounded-lg" />
              <div className="w-[70%]">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full mt-4" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-4 " />
              </div>
            </div>
            <div className="flex items-center gap-8 p-4">
              <Skeleton className="h-[60px] w-[60px] rounded-lg" />
              <div className="w-[70%]">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full mt-4" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-4 " />
              </div>
            </div>
          </>
        ) : products.length > 0 ? (
          products.map((product, index) => {
            return (
              <Link
                key={product.id}
                href={`/${product.Product_Category?.slug}/${product?.slug}`}
                className={`flex gap-8 items-center p-4 ${
                  index < products.length - 1 && "border-b"
                } hover:bg-neutral-200 transition duration-300 `}
              >
                <div>
                  <Image
                    alt={product.name}
                    src={product.image}
                    width={60}
                    height={60}
                    className="object-cover"
                  />
                </div>
                <div className=" p-2 flex flex-col gap-4">
                  <h4 className="text-base font-bold ">
                    {product.name} | Chính hãng VN/A
                  </h4>
                  <span className="text-base text-red-600 font-bold">
                    {Number(product.price).toLocaleString("vi-en")}
                    <sup>đ</sup>
                  </span>
                </div>
                <div className="text-sm hover:underline flex-1 text-right justify-end">
                  Chi tiết
                </div>
              </Link>
            );
          })
        ) : (
          <p className="w-full text-center">Không tìm thấy sản phẩm</p>
        )}
      </div>
    </>
  );
};
export default ListProductSearch;
