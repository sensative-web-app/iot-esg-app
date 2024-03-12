import { SessionData } from "@/lib/session";
import { getNodes } from "@/actions";

export const NodeSettings = async (nodes: string[]) => {
  return <div className="pt-8">total nodes: {nodes.length}</div>;
};
