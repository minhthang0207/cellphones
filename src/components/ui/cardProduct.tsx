import Image from "next/image";
import { MdOutlineStar } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import Link from "next/link";

interface CardProductProps {
  product: Product;
}

const CardProduct: React.FC<CardProductProps> = ({ product }) => {
  return (
    <Link
      href={`/${product.Product_Category?.slug}/${product?.slug}`}
      className=" block shadow-sm border rounded-lg hover:shadow-lg transition duration-200 bg-white group"
    >
      <div className="relative h-[163px] mt-4 mx-2 group-hover:-translate-y-3 transition-transform duration-300">
        <Image
          fill
          alt={product.name}
          src={product.image}
          className="object-contain h-[163px]"
        />
      </div>
      <div className="p-2 flex flex-col gap-4">
        <h4 className="text-base h-[40px] leading-[19px] line-clamp-2 transition duration-300 group-hover:text-red-600">
          {product.name}
        </h4>
        <span className="text-xl text-red-600 font-bold">
          {Number(product.price).toLocaleString("vi-en")}
          <sup>đ</sup>
        </span>
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2 items-center cursor-pointer">
            <MdOutlineStar size={20} className="text-yellow-400" />
            <span className="text-xs">
              {product.average_rating} ({product.ratings_count})
            </span>
          </div>
          <button type="button">
            <FaRegHeart size={20} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
