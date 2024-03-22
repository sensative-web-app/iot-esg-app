import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { SessionData, sessionOptions } from "@/lib/session";
import { getSession } from "@/actions";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || "";

  const response = await fetch(
    "https://staging.yggio.net/auth/realms/yggio/protocol/openid-connect/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token!,
        client_id: process.env.NEXT_PUBLIC_YGGIO_CLIENT_ID!,
        client_secret: process.env.YGGIO_CLIENT_SECRET!,
      }),
    },
  );

  const data = await response.json();

  const prevSession = await getSession();
  if (prevSession) prevSession!.destroy();

  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  console.log("session i refresh", session);

  session.accessToken = data.access_token;
  session.expires = new Date(new Date().getTime() + data.expires_in * 1000);
  session.refreshToken = data.refresh_token;
  session.refreshExpires = new Date(
    new Date().getTime() + data.refresh_expires_in * 1000,
  );

  await session.save();

  const redirectUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : /^https?:/.test(process.env.APP_URL ?? "")
        ? process.env.APP_URL!
        : `https://${process.env.APP_URL}`;

  return NextResponse.redirect(redirectUrl);
}
