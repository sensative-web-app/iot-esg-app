import { SessionData } from "@/lib/session";
import { PropertyOwner } from "./property-owner/property-owner";
import { TenantDashboard } from "./tenant/tenant-dashboard";

export const Dashboard = async ({
  session,
  nodes,
}: {
  session: SessionData;
  nodes: any[];
}) => {
  return (
    <div className="w-full">
      {session.role === "tenant" && (
        <TenantDashboard session={session} nodes={nodes} />
      )}

      {session.role === "property owner" && <PropertyOwner session={session} />}

      {!session.role && (
        <div>No role assigned / you do not belong to any usergroup yet</div>
      )}
    </div>
  );
};
