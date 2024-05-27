import { getSession, getNodes } from "@/actions";
import { SideNav } from "@/components/nav/side-nav";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default async function Index() {
  const session = await getSession();

  const accessToken = session!.accessToken;
  const nodes = await getNodes(accessToken!);

  const nodesWithTemperature = [];

  for (const node in nodes) {
    if (nodes[node].temperature) {
      nodesWithTemperature.push(nodes[node]);
    }
  }

  return (
    <SideNav role={session.role}>
      <div className="text-primary  flex-col items-center">
        <div className="mt-12">

        </div>
      </div>
    </SideNav>
  );
}
