import { createChannel, getBasicCredentialSet } from "@/actions";
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

  // const channel = await createChannel(session.accessToken!, nodeID)
  //

  const sets = await getBasicCredentialSet(session.accessToken!);

  return (
    <div className="pt-8">
      {userID} + {nodeID}
    </div>
  );
};
