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
          <RadioGroup defaultValue="option-one">
            <Label className="text-xl text-gray-300" htmlFor="option-one">
              Temperature
            </Label>
            {nodesWithTemperature.map((node, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={node.name} id={`option-${index}`} />
                <Label className="text-gray-400" htmlFor={`option-${index}`}>
                  {node.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </SideNav>
  );
}
