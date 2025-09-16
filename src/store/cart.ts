import { CartState, CartItem } from "@/types/cart";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Giả định các hàm API
import {
  getAllCartItem,
  createCartItem,
  updateCartItem,
  deleteCartItem,
} from "@/lib";

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [] as CartItem[],

      fetchCart: async (userId) => {
        try {
          const result = await getAllCartItem(userId);
          if (result.success) {
            set({ cart: result.data.cartItems });
          } else {
            console.error(result.message);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      },

      addToCart: async (userId, item: Variant_Product) => {
        try {
          const result = await createCartItem(userId, item.id);
          if (result.success) {
            set({ cart: [...get().cart, result.data.cartItemWithDetails] });
          } else {
            console.error(result.message);
          }
          return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra",
          };
        } catch (error) {
          console.error("Error adding to cart:", error);
          return {
            success: false,
            message: "Có lỗi xảy ra vui lòng thử lại sau",
          };
        }
      },

      updateCart: async (itemId, quantity) => {
        try {
          const result = await updateCartItem(itemId, quantity);
          if (result.success) {
            set({
              cart: get().cart.map((variant) =>
                variant.id === itemId ? { ...variant, quantity } : variant
              ),
            });
          } else {
            console.error(result.message);
          }
          return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra",
          };
        } catch (error) {
          console.error("Error updating cart:", error);
          return {
            success: false,
            message: "Có lỗi xảy ra vui lòng thử lại sau",
          };
        }
      },

      deleteCart: async (itemId) => {
        try {
          const result = await deleteCartItem(itemId);
          if (result.success) {
            set({ cart: get().cart.filter((item) => item.id !== itemId) });
          } else {
            console.error(result.message);
          }
          return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra",
          };
        } catch (error) {
          console.error("Error deleting cart:", error);
          return {
            success: false,
            message: "Có lỗi xảy ra vui lòng thử lại sau",
          };
        }
      },
    }),
    {
      name: "cart-storage", // key lưu trong localStorage
    }
  )
);

export default useCartStore;
