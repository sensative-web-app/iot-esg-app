import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log("data  ", data);

  return new NextResponse(`${data.test}`);
}
