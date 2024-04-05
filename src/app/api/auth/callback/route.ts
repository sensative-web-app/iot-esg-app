import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { NextRequest } from "next/server";
import { SessionData, sessionOptions } from "@/lib/session";
import { getRole, getSession } from "@/actions";

export async function GET(request: NextRequest) {
  const clientID = process.env.NEXT_PUBLIC_YGGIO_CLIENT_ID!;
  const clientSecret = process.env.YGGIO_CLIENT_SECRET!;
  const redirectUri = process.env.NEXT_PUBLIC_YGGIO_REDIRECT_URI!;

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code") || "";

  const response = await fetch(
    "https://staging.yggio.net/auth/realms/yggio/protocol/openid-connect/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientID,
        client_secret: clientSecret,
      }),
    },
  );

  const data = await response.json();

  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  const { access_token, expires_in, refresh_token, refresh_expires_in } = data;

  session.accessToken = access_token;
  session.expires = new Date(new Date().getTime() + expires_in * 1000);

  session.refreshToken = refresh_token;
  session.refreshExpires = new Date(
    new Date().getTime() + refresh_expires_in * 1000,
  );

  const role = await getRole(access_token);

  if (role) session.role = role;

  await session.save();

  const redirectUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : /^https?:/.test(process.env.APP_URL ?? "")
        ? process.env.APP_URL!
        : `https://${process.env.APP_URL}`;

  return Response.redirect(redirectUrl);
}
