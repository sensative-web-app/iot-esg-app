import { Login } from "@/components/login";
import { getSession } from "@/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const session = await getSession();

  return (
    <div className="text-primary flex h-[calc(100vh-64px)]  justify-center">
      {!session.isLoggedIn && <Login />}
    </div>
  );
}
