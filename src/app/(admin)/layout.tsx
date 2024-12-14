import { Sarabun } from "next/font/google";
import "../globals.css";
import type { Metadata } from "next";
import AdminLayoutWrapper from "@/components/organisms/LayoutWrapper/AdminLayoutWrapper";
import { Toaster } from "@/components/ui/sonner";

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
      <body className={sarabun.className}>
        <Toaster position="top-center" />
        <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
      </body>
    </html>
  );
}
