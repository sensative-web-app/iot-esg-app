import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/actions";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  let session = await getSession();

  if (Object.keys(session).length === 0 && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url).toString());
  }

  if (
    request.nextUrl.pathname === "/reports" &&
    session?.role !== "property owner"
  ) {
    return NextResponse.redirect(new URL("/", request.url).toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
