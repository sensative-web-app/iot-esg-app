import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { NextResponse } from "next/server";
import { getBasicCredentialSet, getNodes, getRole, getUser } from "@/actions";
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

    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions,
    );

    const { token } = data;
    const user = await getUser(token);
    const set = await getBasicCredentialSet(user._id, token);
    const nodes = await getNodes(token);

    const temperatureNode = nodes.find((node: any) =>
      node.name.includes("Comfort"),
    );
    const co2Node = nodes.find((node: any) => node.name.includes("CO2"));

    session.accessToken = token;
    session.userID = user._id;
    session.setID = set._id;
    session.co2NodeID = co2Node._id;
    session.temperatureNodeID = temperatureNode._id;
    session.expire = new Date().getTime() + 1000 * 60 * 60 * 5;

    const role = await getRole(token);
    session.role = role ? role : "not assigned";

    await session.save();

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
