"use client";

import { usePathname } from "next/navigation";
import Footer from "../Footer";
import Header from "../Header";

const NormalLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const hideFooter =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/verify" ||
    pathname === "/forgot-password";
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
