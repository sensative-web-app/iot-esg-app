import { Login } from "@/components/auth/login";
import { getSession, refreshTokenIfNecessary } from "@/actions";
import { Dashboard } from "@/components/home/dashboard";

// prevent caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  let session = await getSession();
  if (session) session = await refreshTokenIfNecessary(session);

  return (
    <div className="text-primary flex h-[calc(100vh-64px)]  justify-center">
      {!session.isLoggedIn ? <Login /> : <Dashboard session={session} />}
    </div>
  );
}
