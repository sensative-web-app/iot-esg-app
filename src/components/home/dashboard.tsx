import { SessionData } from "@/lib/session";
import { PropertyOwner } from "./property-owner/property-owner";
import { TenantDashboard } from "./tenant/tenant-dashboard";
import { getNodes } from "@/actions";

export const Dashboard = async ({ session }: { session: SessionData }) => {
  const { accessToken, userID, setID } = session!;
  const nodes = await getNodes(session.accessToken);

  return (
    <div className="w-full">
      {session.role === "tenant" && (
        <TenantDashboard
          nodes={nodes}
          userID={userID!}
          setID={setID!}
          token={accessToken!}
        />
      )}

      {session.role === "property owner" && <PropertyOwner session={session} />}

      {(!session.role || session.role === "") && (
        <div>No role assigned / you do not belong to any usergroup yet</div>
      )}
    </div>
  );
};
