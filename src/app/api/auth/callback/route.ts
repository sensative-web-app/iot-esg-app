import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { NextRequest } from "next/server";
import { SessionData, sessionOptions } from "@/lib/session";

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

  console.log("data  ", data);
  const { access_token, refresh_token, expires_in } = data;

  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (access_token && refresh_token) {
    session.accessToken = access_token;
    session.refreshToken = refresh_token;
    session.isLoggedIn = true;

    const expiresInMs = expires_in * 1000;
    const expiresDate = new Date(new Date().getTime() + expiresInMs);
    session.expires = expiresDate;
  }

  await session.save();
  const redirectUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : `https://${process.env.APP_URL}`;

  return Response.redirect(redirectUrl);
}
