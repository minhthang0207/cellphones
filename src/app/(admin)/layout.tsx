import { Sarabun } from "next/font/google";
import "../globals.css";
import type { Metadata } from "next";
import AdminLayoutWrapper from "@/components/organisms/LayoutWrapper/AdminLayoutWrapper";

const sarabun = Sarabun({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CellphoneS Admin Dashboard",
  description: "CellphoneS Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={sarabun.className}>
        <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
      </body>
    </html>
  );
}
