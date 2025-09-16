"use client";

import { usePathname, useRouter } from "next/navigation";
import Footer from "../Footer";
import Header from "../Header";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user";
import { getUser } from "@/lib";
import useCartStore from "@/store/cart";
import useWishlistStore from "@/store/wishlist";

const NormalLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);
  const user = useUserStore((state) => state.user);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchWishList = useWishlistStore((state) => state.fetchWishList);
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
    const unsubHydrate = useUserStore.persist.onHydrate(() => setReady(false));

    const unsubFinishHydration = useUserStore.persist.onFinishHydration(() => setReady(true));

    setReady(useUserStore.persist.hasHydrated());

    return () => {
      unsubHydrate()
      unsubFinishHydration()
    };
    
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const result = await getUser();
      if (result.success && result.data.user) {
        addUser(result.data.user);

        if(result.data.user.role === "admin") {
          router.push("/dashboard-admin");
          return;
        }
        await Promise.all([
          fetchCart(result.data.user.id),
          fetchWishList(result.data.user.id),
        ]);
      }
    };

    if (!ready) return;

    if (Object.keys(user).length > 0 && user && !isAuthPage) {
      if (user.role === "admin") {
        router.push("/dashboard-admin");
      }
    }

    if (Object.keys(user).length === 0 && !isAuthPage) {
      fetchUserData();
    }

  }, [user, isAuthPage, addUser, router, fetchCart, fetchWishList, ready]);   
  
  return (
    <div className="w-full h-screen  ">
      {/* <Toaster position="top-center" /> */}

      <div>
        <Header />
        {children}
        {!hideFooter && <Footer />}
      </div>
    </div>
  );
};

export default NormalLayoutWrapper;
