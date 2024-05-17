import { NextResponse, type NextRequest } from "next/server";
import { getRole, getSession } from "@/actions";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  let session = await getSession();

  if (
    Object.keys(session).length === 0 &&
    request.nextUrl.pathname !== "/login"
  ) {
    return NextResponse.redirect(new URL("/login", request.url).toString());
  }

  if (session && !session.role) {
    const role = await getRole(session.accessToken);
    session.role = role ? role : "tenant";
    console.log("User role: " + session.role);
  }
  if (
    request.nextUrl.pathname === "/reports" &&
    session?.role !== "property-owner"
  ) {
    return NextResponse.redirect(new URL("/", request.url).toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
