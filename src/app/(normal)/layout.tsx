import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "../globals.css";
import NormalLayoutWrapper from "@/components/organisms/LayoutWrapper/NormalLayoutWrapper";
import { Toaster } from "@/components/ui/sonner";
import Snowfall from "@/components/ui/SnowFall";

const sarabun = Sarabun({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CellphoneS",
  description: "CellphoneS",
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
        <Snowfall />
        <NormalLayoutWrapper>{children}</NormalLayoutWrapper>
      </body>
    </html>
  );
}
