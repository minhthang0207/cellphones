import { User, UserState } from "@/types/user";
import { create } from "zustand";

export const useUserStore = create<UserState>((set) => ({
  user: {} as User,
  addUser: (user: User) => set(() => ({ user })),
  updateUser: (newUser: Partial<User>) =>
    set((state) => ({
      user: { ...state.user, ...newUser }, // Merge old user state with new fields
    })),
}));
