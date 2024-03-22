import { SessionData } from "@/lib/session";
import { getBasicCredentialSet, getUser } from "@/actions";

export const Dashboard = async ({
  session,
  nodes,
}: {
  session: SessionData;
  nodes: any[];
}) => {
  const user = await getUser(session!);
  console.log("user", user);
  const userID = user._id;

  const nodesWithTemperature = [];

  for (const node in nodes) {
    if (nodes[node].temperature) {
      nodesWithTemperature.push(nodes[node]);
    }
  }
  const node = nodes.find((node) => node.name.includes("Comfort"));
  const nodeID = node._id;
  const set = await getBasicCredentialSet(userID, session.accessToken!);

  console.log(set);

  return <div className="pt-8"></div>;
};
