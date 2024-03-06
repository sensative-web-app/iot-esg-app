import { NextResponse, type NextRequest } from "next/server";
import { getSession, refreshTokenIfNecessary } from "@/actions";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  let session = await getSession();

  if (!session.isLoggedIn && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url).toString());
  } else {
    session = await refreshTokenIfNecessary(session);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
