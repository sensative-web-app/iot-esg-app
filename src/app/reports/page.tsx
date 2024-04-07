import { getSession } from "@/actions";
import { SideNav } from "@/components/nav/side-nav";

export default async function Index() {
  const session = await getSession();
  return (
    <SideNav role={session.role}>
      <div className="text-primary flex min-h-[calc(100vh-64px)]  w-full flex-col items-center pt-12">
        reports
      </div>
    </SideNav>
  );
}
