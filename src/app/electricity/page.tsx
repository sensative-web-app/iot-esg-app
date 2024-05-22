import { getSession, getNodeByContext } from "@/actions";
import ChartWrapper from "@/components/home/tenant/chart-wrapper";
import { SideNav } from "@/components/nav/side-nav";

export default async function Index() {
  const session = await getSession();
  const elecNode = await getNodeByContext(session.accessToken, "electricity")
  return (
    <SideNav role={session.role}>
      <div className="text-primary flex min-h-[calc(100vh-64px)]  w-full flex-col items-center pt-12">
        <ChartWrapper
          accessToken={session.accessToken}
          chart="electricityConsumptionChart"
          chartParams={elecNode._id}
        />
      </div>
    </SideNav>
  );
}
