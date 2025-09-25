import { User, UserState } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import useCartStore from "@/store/cart";
import useWishlistStore from "@/store/wishlist";


export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {} as User,
      addUser: (user: User) => set(() => ({ user })),
      updateUser: (newUser: Partial<User>) =>
        set((state) => ({
          user: { ...state.user, ...newUser }, // Merge old user state with new fields
        })),
      logout: () => {
        // Xóa cookie session
        Cookies.remove("session");

        // Clear các store khác
        useCartStore.persist.clearStorage();
        useWishlistStore.persist.clearStorage();

        // Reset lại state user
        set({ user: {} as User });
      },
    }),
    {
      name: "user-storage", // key trong localStorage
      // onRehydrateStorage: () => (state, error) => {
      //   if (error) console.error(error);
      //   else console.log("Rehydration done", state?.user);
      // },
    }
  )
);
