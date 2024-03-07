import { SessionData } from "@/lib/session";
import { getNodes } from "@/actions";

export const Dashboard = async ({ session }: { session: SessionData }) => {
  const accessToken = session.accessToken;

  console.log(session);
  const nodes = await getNodes(accessToken!);

  // Filter nodes with name matching 'Strips-Comfort-XXXXXX-etc'
  let matchingNodes = nodes.filter((node: any) =>
    node.name.startsWith("Strips-Comfort"),
  );
  console.log(matchingNodes);
  const nodeIds = nodes.map((node: any) => node._id);

  return <div className="pt-8">total nodes: {nodes.length}</div>;
};
