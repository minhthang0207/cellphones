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

    const wishListItem = wishlist.find((item) => item.product_id === product.id)

    if(!wishListItem) {
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
        toast.success("Đã xóa khỏi danh sách yêu");
      } else {
        toast.error(result.message);
      }
    }

  };
  return (
    <Link
      href={`/${product.Product_Category?.slug}/${product?.slug}`}
      className="block w-full shadow-sm border rounded-lg hover:shadow-lg transition duration-200 bg-white group"
    >
      <div className="relative h-[164px] w-full mt-4 px-2 group-hover:-translate-y-3 transition-transform duration-300">
        <Image
          alt={product.name}
          src={product.image}
          fill
          className="object-cover px-2"
          priority={true}
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
          <button
            type="button"
            className="wishlist-button"
            onClick={(event) => {
              event.preventDefault();
              handleAddToWishlist(product);
            }}
          >
            <FaHeart size={20} className={`heart-icon ${wishlist.find((item) => item.product_id === product.id) && "fill"} ${product.id} `}  />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
