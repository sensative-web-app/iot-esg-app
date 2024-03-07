import { getSession, refreshTokenIfNecessary } from "@/actions";

export async function POST() {
  let session = await getSession();
  session = await refreshTokenIfNecessary(session);

  const sessionJson = JSON.stringify(session);

  return new Response(sessionJson, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
