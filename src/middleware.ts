import { NextResponse, type NextRequest } from "next/server";
import { getSession, logout } from "@/actions";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  let session = await getSession();
  // if (!session?.accessToken) {
  //   return NextResponse.redirect(new URL("/", request.url).toString());
  // }

  // console.log(session);

  // if (session && session.refreshToken && session.expires) {
  //   const now = Date.now();
  //   const expires = new Date(session.expires).getTime();

  //   const anHourBeforeTokenExpires = expires - 3600000;

  //   if (now >= anHourBeforeTokenExpires) {
  //     const refreshToken = session.refreshToken;

  //     return NextResponse.redirect(
  //       new URL(
  //         `/api/auth/refresh?token=${refreshToken}`,
  //         request.url,
  //       ).toString(),
  //     );
  //   }
  // }

  // if (!session && request.nextUrl.pathname !== "/") {
  //   return NextResponse.redirect(new URL("/", request.url).toString());
  // }

  if (
    request.nextUrl.pathname === "/reports" &&
    session?.role !== "property owner"
  ) {
    return NextResponse.redirect(new URL("/", request.url).toString());
  }

  // const requestHeaders = new Headers(request.headers);
  // requestHeaders.set("x-url", request.url);

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
