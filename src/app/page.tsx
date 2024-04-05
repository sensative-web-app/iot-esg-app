import { Login } from "@/components/auth/login";
import { getSession, getNodes } from "@/actions";
import { Dashboard } from "@/components/home/dashboard";

// prevent caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Index() {
  let session = await getSession();

  if (Object.keys(session).length === 0) {
    return (
      <div className="flex w-full justify-center  text-primary">
        <Login />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] justify-center  text-primary">
      <Dashboard session={session!} />
    </div>
  );
}
