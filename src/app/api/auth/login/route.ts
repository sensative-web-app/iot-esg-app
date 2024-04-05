import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { NextResponse } from "next/server";
import { getRole } from "@/actions";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_YGGIO_API_URL}/auth/local`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      },
    );

    if (!response.ok) {
      if (response.statusText === "Unauthorized") {
        throw new Error("Invalid credentials");
      }
      throw new Error("Something went wrong");
    }
    const data = await response.json();

    console.log("data", data);

    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions,
    );
    const { token } = data;
    session.accessToken = token;

    const role = await getRole(token);
    if (role) session.role = role;

    await session.save();

    const redirectUrl = `${process.env.APP_URL}/settings`;

    console.log(redirectUrl);

    // return NextResponse.redirect(redirectUrl);
    // console.log("session i endpoint", session);

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
