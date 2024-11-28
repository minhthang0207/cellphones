import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "../globals.css";

const sarabun = Sarabun({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trang không tồn tại",
  description: "Trang không tồn tại",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={sarabun.className}>{children}</body>
    </html>
  );
}
