import Image from "next/image";
import { MdOutlineStar } from "react-icons/md";
import Link from "next/link";
import { useUserStore } from "@/store/user";
import useWishlistStore from "@/store/wishlist";
import { toast } from "sonner";
import { FaHeart } from "react-icons/fa6";

interface CardProductProps {
  product: Product;
}

const CardProduct: React.FC<CardProductProps> = ({ product }) => {
  const user = useUserStore((state) => state.user);
  const addToWishList = useWishlistStore((state) => state.addToWishList);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const deleteWishList = useWishlistStore((state) => state.deleteWishList);

  const handleAddToWishlist = async (product: Product) => {
    if (!user.id) {
      toast.error("Vui lòng đăng nhập để thực hiện chức năng này");
      return;
    }

    const wishListItem = wishlist.find(
      (item) => item.product_id === product.id,
    );

    if (!wishListItem) {
      const result = await addToWishList(user.id, product);
      if (result.success) {
        toast.success("Thêm vào danh sách yêu thích thành công");
      } else {
        toast.error(result.message);
      }
      return;
    } else {
      const result = await deleteWishList(wishListItem.id);
      if (result.success) {
        toast.success("Đã xóa khỏi danh sách yêu thích");
      } else {
        toast.error(result.message);
      }
    }
  };

  // Giả lập tính toán % giảm giá (Nếu trong database product  old_price thì dùng)
  const oldPrice = Number(product.price) * 1.15; // Giả sử giá gốc cao hơn 15%
  const discountPercent = 15;

  return (
    <Link
      href={`/${product.Product_Category?.slug}/${product?.slug}`}
      className="block w-full bg-white border border-gray-100 shadow-sm rounded-md hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
    >
      {/* 1. Badge Giảm giá (Góc trái trên) */}
      <div className="absolute -top-px -left-px z-10 bg-red-600 text-white text-[11px] font-bold px-2 py-1 rounded-br-lg">
        Giảm {discountPercent}%
      </div>

      <div className="relative h-[180px] w-full mt-4 px-4 group-hover:-translate-y-2 transition-transform duration-300">
        <Image
          alt={product.name}
          src={product.image}
          fill
          className="object-contain"
          priority={true}
        />
      </div>

      <div className="p-3 flex flex-col gap-2">
        <h4 className="text-sm font-semibold h-[40px] leading-[20px] line-clamp-2 transition duration-300 group-hover:text-red-600">
          {product.name}
        </h4>

        {/* 2. Khu vực Giá */}
        <div className="flex flex-col">
          <span className="text-lg text-red-600 font-bold">
            {Number(product.price).toLocaleString("vi-VN")}{" "}
            <sup className="underline">đ</sup>
          </span>
          <span className="text-xs text-gray-400 line-through font-medium">
            {oldPrice.toLocaleString("vi-VN")}
            <sup className="underline">đ</sup>
          </span>
        </div>

        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
          <div className="flex gap-1 items-center cursor-pointer">
            <MdOutlineStar size={16} className="text-yellow-400" />
            <span className="text-xs text-gray-500 font-medium">
              {product.average_rating} ({product.ratings_count})
            </span>
          </div>
          <button
            type="button"
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            onClick={(event) => {
              event.preventDefault();
              handleAddToWishlist(product);
            }}
          >
            <FaHeart
              size={18}
              className={`transition-colors duration-300 ${
                wishlist.find((item) => item.product_id === product.id)
                  ? "text-red-500"
                  : "text-gray-300 hover:text-red-400"
              }`}
            />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
