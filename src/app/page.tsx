import { Login } from "@/components/auth/login";
import { getSession } from "@/actions";
import { Dashboard } from "@/components/home/dashboard";

// prevent caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const session = await getSession();

  return (
    <div className="text-primary flex h-[calc(100vh-64px)]  justify-center">
      {!session ? <Login /> : <Dashboard session={session!} />}
    </div>
  );
}
