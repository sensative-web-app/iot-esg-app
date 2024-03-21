import { SessionData } from "@/lib/session";
import { getNodes, getUser } from "@/actions";
import { Temperature } from "./temperature";

export const Dashboard = async ({
  session,
  nodes,
}: {
  session: SessionData;
  nodes: any[];
}) => {
  const user = await getUser(session.accessToken!);
  // const userID = user._id;

  const nodesWithTemperature = [];

  for (const node in nodes) {
    if (nodes[node].temperature) {
      nodesWithTemperature.push(nodes[node]);
    }
  }

  return (
    <div className="pt-8">
      {/* {nodesWithTemperature.length > 0 ? (
        <Temperature
          session={session}
          userID={userID}
          nodes={nodesWithTemperature}
        />
      ) : (
        <div>No nodes with temperature sensors found</div>
      )} */}
    </div>
  );
};
