import { getSession } from "@/actions";
import { NavBar } from "./navbar";
import { SideNav } from "./side-nav";

export async function Nav({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  let options: string[] = [];

  switch (session?.role) {
    case "tenant":
      options = [
        "Dashboard",
        "Temperature",
        "CO2",
        "Electricity",
        "Nodes",
        "Settings",
      ];
      break;
    case "property owner":
      options = [
        "Dashboard",
        "Properties",
        "Tenants",
        "Maintenance",
        "Billing",
        "Settings",
      ];
      break;
    case "property manager":
      options = [
        "Dashboard",
        "Properties",
        "Tenants",
        "Maintenance",
        "Billing",
        "Reports",
        "Settings",
      ];
      break;
    default:
      options = ["Dashboard", "Settings"];
  }

  return (
    <div>
      <NavBar role={session?.role ? session.role : ""} />

      <SideNav
        session={session?.role ? session.role : undefined}
        options={options}
      >
        {children}
      </SideNav>
    </div>
  );
}
