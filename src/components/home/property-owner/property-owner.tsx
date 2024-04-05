import { SessionData } from "@/lib/session";

export const PropertyOwner = async ({ session }: { session: SessionData }) => {
  return <div className="pt-8">a {session.role} has logged in</div>;
};
