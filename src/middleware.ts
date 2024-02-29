import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/actions";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/api/auth/callback")
  ) {
    return NextResponse.next();
  }

  const session = await getSession();

  if (!session.isLoggedIn && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url).toString());
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };
