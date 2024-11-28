import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  // Bỏ qua middleware cho các tệp tĩnh, bao gồm CSS, JS, và hình ảnh
  const PUBLIC_FILE = /\.(.*)$/;

  if (PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }
  // Danh sach listcategory hop le
  const validCategories = [
    "dtdd",
    "laptop",
    "phu-kien",
    "dong-ho",
    "dong-ho-thong-minh",
    "man-hinh",
  ];

  if (
    pathname === "/" ||
    pathname.startsWith("/error") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/verify") ||
    pathname.startsWith("/forgot-password")
  ) {
    return NextResponse.next();
  }
  const slug = pathname.split("/")[1];

  const matchedSlug = validCategories.find((category) =>
    slug.startsWith(category)
  );

  if (!matchedSlug) {
    return NextResponse.redirect(new URL("/error", request.url));
  }

  if (slug !== matchedSlug) {
    // Nếu slug không khớp chính xác, chuyển hướng tới slug hợp lệ
    url.pathname = `/${matchedSlug}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
