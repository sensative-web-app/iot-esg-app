import { getSession, getNodes } from "@/actions";
import { SideNav } from "@/components/nav/side-nav";
import { NodeTable } from "@/components/node-table";
import { redirect } from "next/navigation";

export default async function Index() {
  const session = await getSession();

  if (Object.keys(session).length === 0) {
    return redirect("/login");
  }

  const accessToken = session!.accessToken;
  const nodes = await getNodes(accessToken!);

  return (
    <SideNav role={session.role}>
      <div className="h-full w-full">
        {nodes && <NodeTable nodes={nodes} />}
      </div>
    </SideNav>
  );
}
