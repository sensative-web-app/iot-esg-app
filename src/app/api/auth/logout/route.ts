import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { SessionData } from "@/lib/session";

export async function GET(request: Request) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  session.destroy();
  return NextResponse.redirect(`${process.env.APP_URL}/`);
}
