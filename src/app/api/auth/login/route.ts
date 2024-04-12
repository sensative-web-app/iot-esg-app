import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { NextResponse } from "next/server";
import { getNodes, getRole, getUser } from "@/actions";
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
      if (response.status === 401) {
        throw new Error("Invalid credentials");
      }
      throw new Error("Something went wrong");
    }
    const data = await response.json();

    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions,
    );

    const { token } = data;
    // const user = await getUser(token);
    const nodes = await getNodes(token);
    // console.log(user);
    session.accessToken = token;
    // session.userID = user._id;

    session.nodes = nodes.map((node: any) => ({
      name: node.name,
      id: node._id,
    }));
    session.expire = new Date().getTime() + 1000 * 60 * 60 * 5;

    const role = await getRole(token);

    session.role = role ? role : "tenant";
    console.log(role);

    await session.save();

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
