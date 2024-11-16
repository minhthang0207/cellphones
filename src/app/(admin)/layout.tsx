import { Sarabun } from "next/font/google";
import "../globals.css";
import type { Metadata } from "next";

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
      <body className={sarabun.className}>{children}</body>
    </html>
  );
}
