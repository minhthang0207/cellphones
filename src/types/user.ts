export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string | undefined;
  address: string | undefined;
  gender: boolean | undefined;
  birth: string;
  role: "user" | "admin";
  passwordResetToken?: string | undefined;
  passwordResetExpires?: string | undefined;
  isVerify: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  user: User;
  // eslint-disable-next-line no-unused-vars
  addUser: (user: User) => void;
  updateUser: (newUser: Partial<User>) => void;
  logout: () => void;
}
