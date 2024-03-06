import { getSession, getNodes } from "@/actions";
import { NodeTable } from "@/components/node-table";

export default async function Index() {
  const session = await getSession();

  const accessToken = session.accessToken;
  const nodes = await getNodes(accessToken!);

  console.log(nodes);
  return (
    <div className="text-primary flex min-h-[calc(100vh-64px)]  w-full flex-col items-center pt-12">
      {nodes && <NodeTable nodes={nodes} />}
    </div>
  );
}
