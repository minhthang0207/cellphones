import Link from "next/link";
import Loading from "../Loading";
import ProductGrid from "./ProductGrid";

interface ProductGroupProps {
    label: string;
    linkAll: string;
    isLoading: boolean;
    listBrand: {title: string, link: string}[],
    product: Product[]
}
const ProductGroup = ({
    label,
    linkAll,
    isLoading,
    listBrand,
    product,
} : ProductGroupProps) => {
  return (
    <div className="mt-3 border rounded-lg shadow-sm p-4 overflow-hidden">
        <div className="w-full flex flex-col md:flex-row justify-between items-start mb-4">
          <div className="w-full md:w-auto flex justify-between items-center mb-4">
            <span className="font-bold text-3xl">{label}</span>
            <Link href={`${linkAll}`} className="md:hidden ml-auto">Xem tất cả</Link>
          </div>
          <div className="flex items-center gap-3 md:ml-auto md:w-auto overflow-x-auto scrollbar-hide">
            {listBrand.map((item, index) => {
              return (
                <Link
                  href={item.link}
                  key={index}
                  className="border rounded-lg p-2 capitalize hover:text-white hover:bg-red-500 transition duration-200"
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
        {isLoading ? (
          <div className=" h-[400px]">
            <Loading fullWeb={false} />
          </div>
        ) : (
          <ProductGrid products={product} />
        )}
    </div>
  )
}

export default ProductGroup