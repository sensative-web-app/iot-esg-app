import { getSession } from "@/actions";
import { Dashboard } from "@/components/home/dashboard";
import { SideNav } from "@/components/nav/side-nav";

// prevent caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Index() {
  let session = await getSession();

  return (
    <div className="flex h-[calc(100vh-64px)] justify-center  text-primary">
      <SideNav role={session.role}>
        <Dashboard session={session!} />
      </SideNav>
    </div>
  );
}
