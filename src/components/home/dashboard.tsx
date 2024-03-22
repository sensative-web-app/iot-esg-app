import { SessionData } from "@/lib/session";
import { Tenant } from "./views/tenant";
import { PropertyOwner } from "./views/property-owner";

export const Dashboard = async ({
  session,
  nodes,
}: {
  session: SessionData;
  nodes: any[];
}) => {
  return (
    <div className="pt-8">
      {session.role === "tenant" && <Tenant session={session} />}

      {session.role === "property owner" && <PropertyOwner session={session} />}

      {!session.role && (
        <div>No role assigned / you do not belong to any usergroup yet</div>
      )}
    </div>
  );
};
