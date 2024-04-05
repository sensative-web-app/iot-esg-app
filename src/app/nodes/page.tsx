import { getSession, getNodes } from "@/actions";
import { NodeTable } from "@/components/node-table";

export default async function Index() {
  const session = await getSession();

  const accessToken = session!.accessToken;
  const nodes = await getNodes(accessToken!);

  return <div className="">{nodes && <NodeTable nodes={nodes} />}</div>;
}
