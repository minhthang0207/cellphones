import Image from "next/image";
import { MdOutlineStar } from "react-icons/md";
import Link from "next/link";
import useWishlistStore from "@/store/wishlist";
import { toast } from "sonner";
import CustomAlertDialog from "@/components/ui/alert-dialog-custom";
import { useState } from "react";
import Loading from "../Loading";

interface WishListItem {
  id: string;
  user_id: string;
  product_id: string;
  createdAt: string;
  updatedAt: string;
  Product: Product;
}

interface CardWishListProps {
  item: WishListItem;
}

const CardWishList: React.FC<CardWishListProps> = ({ item }) => {
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const deleteWishList = useWishlistStore((state) => state.deleteWishList);

  const handleDelete = async () => {
    setIsLoading(true);

    const result = await deleteWishList(item.id);
    if (result.success) {
      toast.success("Đã xóa khỏi danh sách yêu");
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  };

  const handleCancel = () => {
    setIsShowAlert(false); // Đóng dialog
  };

  const handleDeleteWishlist = (event: React.MouseEvent) => {
    event.preventDefault(); // Ngăn hành vi mặc định
    event.stopPropagation(); // Ngăn sự kiện lan truyền
    setIsShowAlert(true);
  };
  if (isLoading) {
    return <Loading fullWeb={true} hasOverLay={true} />;
  }
  return (
    <div className="block shadow-sm border rounded-lg hover:shadow-lg transition duration-200 bg-white group">
      <Link
        href={`/${item.Product?.Product_Category?.slug}/${item?.Product?.slug}`}
        className=" "
      >
        <div className="relative h-[163px] mt-4 mx-2 group-hover:-translate-y-3 transition-transform duration-300">
          <Image
            fill
            alt={item.Product.name}
            src={item.Product.image}
            className="object-contain h-[163px]"
          />
        </div>
        <div className="p-2 flex flex-col gap-4">
          <h4 className="text-base h-[40px] leading-[19px] line-clamp-2 transition duration-300 group-hover:text-red-600">
            {item.Product.name}
          </h4>
          <span className="text-xl text-red-600 font-bold">
            {Number(item.Product.price).toLocaleString("vi-en")}
            <sup>đ</sup>
          </span>
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2 items-center cursor-pointer">
              <MdOutlineStar size={20} className="text-yellow-400" />
              <span className="text-xs">
                {item.Product.average_rating} ({item.Product.ratings_count})
              </span>
            </div>
          </div>
        </div>
      </Link>
      <button
        type="button"
        className="font-semibold hover:underline w-full mb-2"
        onClick={handleDeleteWishlist}
      >
        Xóa
      </button>
      {isShowAlert && (
        <CustomAlertDialog
          title="Bạn chắc chắn muốn xóa?"
          description="Thao tác này sẽ không thể hoàn tác."
          onConfirm={() => handleDelete()}
          onCancel={handleCancel}
          isOpen={isShowAlert}
          onClose={() => setIsShowAlert(false)}
        />
      )}
    </div>
  );
};

export default CardWishList;
