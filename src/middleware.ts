import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/actions";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  let session = await getSession();

  if (session) {
    if (session.refreshToken && session.expires) {
      const now = Date.now();
      const expires = new Date(session.expires).getTime();

      const anHourBeforeTokenExpires = expires - 3600000;

      if (now >= anHourBeforeTokenExpires) {
        return NextResponse.redirect(
          new URL(
            `/api/auth/refresh?token=${session.refreshToken}`,
            request.url,
          ).toString(),
        );
      }
    }
  }

  if (!session && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url).toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
