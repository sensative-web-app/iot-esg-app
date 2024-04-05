import ChartWrapper from "@/components/home/tenant/chart-wrapper";
import { getNode, getSession } from "@/actions";
import { Co2 } from "@/components/home/tenant/co2";

export default async function Index() {
  const session = await getSession();
  const { accessToken, setID, userID, co2NodeID } = session;

  const node = await getNode(accessToken!, co2NodeID!);

  return (
    <div className="text-primary flex min-h-[calc(100vh-64px)]  w-full flex-col items-center pt-6">
      <div className="w-full h-full justify-center">
        <div className="flex w-full justify-center ">
          <Co2
            nodeID={node._id}
            currentValue={node.co2}
            reportedAt={node.reportedAt}
            setID={setID!}
            userID={userID!}
          />
        </div>
        <div>
          <ChartWrapper chart="co2Chart" accessToken={accessToken!} />
        </div>
      </div>
    </div>
  );
}
