import { User, UserState } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {} as User,
      addUser: (user: User) => set(() => ({ user })),
      updateUser: (newUser: Partial<User>) =>
        set((state) => ({
          user: { ...state.user, ...newUser }, // Merge old user state with new fields
        })),
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
