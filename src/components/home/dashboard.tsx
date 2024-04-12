import { SessionData } from "@/lib/session";
import { PropertyOwner } from "./property-owner/property-owner";
import { TenantDashboard } from "./tenant/tenant-dashboard";

export const Dashboard = async ({ session }: { session: SessionData }) => {
  const { accessToken } = session;

  return (
    <div className="w-full">
      {session.role === "tenant" && (
        <TenantDashboard
          setID={process.env.NEXT_PUBLIC_SET_ID!}
          token={accessToken!}
        />
      )}

      {session.role === "property-owner" && <PropertyOwner session={session} />}

      {(!session.role || session.role === "") && (
        <div>No role assigned / you do not belong to any usergroup yet</div>
      )}
    </div>
  );
};
