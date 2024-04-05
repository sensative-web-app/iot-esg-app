import { SessionData } from "@/lib/session";
import { PropertyOwner } from "./property-owner/property-owner";
import { TenantDashboard } from "./tenant/tenant-dashboard";
import { getUser, getBasicCredentialSet } from "@/actions";

export const Dashboard = async ({
  session,
  nodes,
}: {
  session: SessionData;
  nodes: any[];
}) => {
  const user = await getUser(session.accessToken!);
  const set = await getBasicCredentialSet(user._id, session.accessToken!);
  return (
    <div className="w-full">
      {session.role === "tenant" && (
        <TenantDashboard
          user={user}
          set={set}
          token={session!.accessToken}
          nodes={nodes}
        />
      )}

      {session.role === "property owner" && <PropertyOwner session={session} />}

      {!session.role && (
        <div>No role assigned / you do not belong to any usergroup yet</div>
      )}
    </div>
  );
};
