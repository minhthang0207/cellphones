"use client";
import useWishlistStore from "@/store/wishlist";
import CardWishList from "./CardWishList";

const WishlistForm: React.FC = () => {
  const wishlist = useWishlistStore((state) => state.wishlist);
  return (
    <div className="max-w-[1280px] mx-auto h-fit p-4">
      <h4 className="mx-auto text-center text-2xl font-bold mb-6">
        Danh sách yêu thích
      </h4>

      <p className="my-4">Tổng số lượng: {wishlist.length}</p>
      <div className="grid grid-cols-5 gap-4">
        {wishlist.map((item) => {
          return <CardWishList item={item} key={item.id} />;
        })}
      </div>
    </div>
  );
};
export default WishlistForm;
