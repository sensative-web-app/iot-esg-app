import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  let session = await getIronSession<SessionData>(cookies(), sessionOptions);

  const refreshToken = await req.json();

  const response = await fetch(
    "https://staging.yggio.net/auth/realms/yggio/protocol/openid-connect/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken!,
        client_id: process.env.NEXT_PUBLIC_YGGIO_CLIENT_ID!,
        client_secret: process.env.YGGIO_CLIENT_SECRET!,
      }),
    },
  );

  const data = await response.json();

  session.accessToken = data.access_token;
  session.refreshToken = data.refresh_token;
  session.expires = new Date(new Date().getTime() + data.expires_in * 1000);
  session.refreshExpires = new Date(
    new Date().getTime() + data.refresh_expires_in * 1000,
  );

  await session.save();

  return Response.json({ session: session });
}
