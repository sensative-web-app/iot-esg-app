import { getSession } from "@/actions";
import { SideNav } from "@/components/nav/side-nav";
import { NodeTable } from "@/components/node-table";
import { fetchNodes } from "@/lib/queryHelper";
import { QueryClient } from "@tanstack/react-query";

export default async function Index() {
  const session = await getSession();

  const accessToken = session!.accessToken;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["nodes"],
    queryFn: () => fetchNodes(session.accessToken),
  });

  return (
    <SideNav role={session.role}>
      <div className="h-full w-full">
        <NodeTable token={accessToken} />
      </div>
    </SideNav>
  );
}
