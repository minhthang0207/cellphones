import { WishListState } from "@/types/wishlist";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Giả định các hàm API
import {
  getAllWishListItem,
  createWishListItem,
  deleteWishListItem,
} from "@/libStatistic";

const useWishlistStore = create<WishListState>()(
  persist(
    (set, get) => ({
      wishlist: [],

      fetchWishList: async (userId) => {
        try {
          const result = await getAllWishListItem(userId);
          if (result.success) {
            set({ wishlist: result.data.wishlistItems });
          } else {
            console.error(result.message);
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu:", error);
        }
      },

      addToWishList: async (userId, item: Product) => {
        try {
          const result = await createWishListItem(userId, item.id);
          if (result.success) {
            set({
              wishlist: [...get().wishlist, result.data.wishlistItemWithDetails],
            });
          } else {
            console.error(result.message);
          }
          return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra",
          };
        } catch (error) {
          console.error("Error adding to wishlist:", error);
          return {
            success: false,
            message: "Có lỗi xảy ra vui lòng thử lại sau",
          };
        }
      },

      deleteWishList: async (itemId) => {
        try {
          const result = await deleteWishListItem(itemId);
          if (result.success) {
            set({
              wishlist: get().wishlist.filter((item) => item.id !== itemId),
            });
          } else {
            console.error(result.message);
          }
          return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra",
          };
        } catch (error) {
          console.error(
            "Có lỗi khi xóa sản phẩm ra khỏi danh sách yêu thích:",
            error
          );
          return {
            success: false,
            message: "Có lỗi xảy ra vui lòng thử lại sau",
          };
        }
      },
    }),
    {
      name: "wishlist-storage", // key trong localStorage
    }
  )
);

export default useWishlistStore;
