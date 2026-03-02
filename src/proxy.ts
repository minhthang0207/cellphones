import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { USER_PROTECTED, ADMIN_PROTECTED, AUTH_ROUTES } from "@/routes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const isAuthRoute = AUTH_ROUTES.includes(url.pathname);
  const token = req.cookies.get("session")?.value;
  console.log(token);
  if (!token) {
    // === CASE 1: Không có token -> chỉ chặn các route cần login ===
    const isUserProtected = USER_PROTECTED.some((r) =>
      url.pathname.startsWith(r),
    );
    const isAdminProtected = ADMIN_PROTECTED.some((r) =>
      url.pathname.startsWith(r),
    );

    if (isUserProtected || isAdminProtected) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Còn route public thì cho đi
    return NextResponse.next();
  }

  // === CASE 2: Có token -> verify ===
  try {
    // Mã hóa secret giống như khi sign JWT ở backend
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    // Xác thực + giải mã token
    const { payload } = await jwtVerify(token, secret);

    // ✅ Nếu đã đăng nhập mà vào /login hoặc /register => redirect về "/"
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ Nếu là admin mới được vào /admin-dashboard
    if (
      ADMIN_PROTECTED.some((r) => url.pathname.startsWith(r)) &&
      payload.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT error:", err);

    const response = NextResponse.redirect(new URL("/login", req.url));
    // ✅ Xóa session cookie
    response.cookies.delete("session");
    return response;
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    // '/(api|trpc)(.*)',
  ],
};
