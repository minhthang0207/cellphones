import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  DEFAULT_LOGIN_USER_REDIRECT,
  authRoutes,
} from "@/routes"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const isAuthRoute = authRoutes.includes(url.pathname);
  const token = req.cookies.get("session")?.value;

  if (!token) {
    // Nếu đang vào các route cần auth mà không có token → redirect login
    if (
      url.pathname.startsWith("/lich-su-mua-hang") ||
      url.pathname.startsWith("/dashboard-admin")
    ) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_USER_REDIRECT, req.url));
    }

    // Còn route public thì cho đi
    return NextResponse.next();
  }


  try {
    
    // Mã hóa secret giống như khi sign JWT ở backend
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    // Xác thực + giải mã token
    const { payload } = await jwtVerify(token, secret);

    // console.log(payload)

    // // Nếu đã đăng nhập thành công và vào các trang authRoute thì sẽ redirect lại "/"
    // if(isAuthRoute) {
    //   return NextResponse.redirect(new URL(DEFAULT_LOGIN_USER_REDIRECT, req.url));
    // }

    // ✅ Nếu chưa đăng nhập thì vẫn được vào "/" hoặc "/login", "/register"
    if (!token) {
      if (url.pathname.startsWith("/admin-dashboard")) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    }

    // ✅ Nếu đã đăng nhập mà vào /login hoặc /register => redirect về "/"
    if(isAuthRoute) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_USER_REDIRECT, req.url));
    }

    // ✅ Nếu là admin mới được vào /admin-dashboard
    if (url.pathname.startsWith("/admin-dashboard") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT error:", err);
    return NextResponse.redirect(new URL("/", req.url));

  }
}

export const config = {
    matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    // '/(api|trpc)(.*)',
  ],
}
