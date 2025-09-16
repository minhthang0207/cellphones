import { Sarabun } from "next/font/google";
import "../globals.css";
import type { Metadata } from "next";
import AdminLayoutWrapper from "@/components/organisms/LayoutWrapper/AdminLayoutWrapper";
import { Toaster } from "@/components/ui/sonner";
import Snowfall from "@/components/ui/SnowFall";

const sarabun = Sarabun({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`h-screen overflow-hidden ${sarabun.className}`}>
        <Toaster position="top-center" />
        <Snowfall />
        <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
      </body>
    </html>
  );
}
