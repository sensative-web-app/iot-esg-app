import { Login } from "@/components/auth/login";
import { getSession, getNodes } from "@/actions";
import { Dashboard } from "@/components/home/dashboard";

// prevent caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Index() {
  let session = await getSession();

  if (!session) {
    return (
      <div className="text-primary flex h-[calc(100vh-64px)]  justify-center">
        <Login />
      </div>
    );
  }

  const accessToken = session!.accessToken;
  const nodes = await getNodes(accessToken!);

  return (
    <div className="text-primary flex h-[calc(100vh-64px)]  justify-center">
      <Dashboard nodes={nodes} session={session!} />
    </div>
  );
}
