"use client";

import { usePathname, useRouter } from "next/navigation";
import Footer from "../Footer";
import Header from "../Header";
import { useEffect } from "react";
import { useUserStore } from "@/store/user";
import { getUser } from "@/lib";

const NormalLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const user = useUserStore((state) => state.user);
  const addUser = useUserStore((state) => state.addUser);
  const router = useRouter();
  const pathname = usePathname();
  const hideFooter =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/verify" ||
    pathname === "/forgot-password";

  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    // const fetchUserData = async () => {
    //   const result = await getUser();
    //   if (result.success && result.data.user) {
    //     addUser(result.data.user);
    //     const updatedUser = useUserStore.getState().user;
    //     if (updatedUser.role === "admin") {
    //       router.push("/dashboard-admin");
    //     }
    //   }
    // };
    const fetchUserData = async () => {
      const result = await getUser();
      if (result.success && result.data.user) {
        addUser(result.data.user);
      }
    };
    if (Object.keys(user).length === 0 && !isAuthPage) {
      fetchUserData();
    }

    if (Object.keys(user).length > 0 && user && !isAuthPage) {
      if (user.role === "admin") {
        router.push("/dashboard-admin");
      }
    }
  }, [user, isAuthPage, addUser, router]);
  return (
    <div className="w-full h-screen overflow-y-scroll overflow-x-hidden ">
      <div>
        <Header />
        {children}
        {!hideFooter && <Footer />}
      </div>
    </div>
  );
};

export default NormalLayoutWrapper;
