import { getChannels } from "@/actions";
import { SessionData } from "@/lib/session";
import { IronSession } from "iron-session";

export const Temperature = async ({
  userID,
  nodes,
  session,
}: {
  userID: string;
  nodes: any[];
  session: SessionData;
}) => {
  const node = nodes.find((node) => node.name.includes("Comfort"));
  const nodeID = node._id;

  const channels = await getChannels(session.accessToken!, nodeID);

  console.log(channels);

  return (
    <div className="pt-8">
      {userID} + {nodeID}
    </div>
  );
};
