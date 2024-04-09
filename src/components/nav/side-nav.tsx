import { Logout } from "../auth/logout";
import { SideNavList } from "./side-nav-list";
import { ErrorBoundary } from "react-error-boundary";

export function SideNav({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  const options = getNavOptions(role);
  return (
    <div
      className={`
        grid w-full ${role !== undefined ? "md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]" : ""}

        `}
    >
      {role !== undefined && (
        <div className="hidden border-r bg-muted/40 md:block">
          <nav className="h-full  text-sm font-medium lg:px-4 flex flex-col">
            <div className="">
              <SideNavList options={options} />
            </div>
            <div className="pt-4 ">
              <Logout />
            </div>
          </nav>
        </div>
      )}
      <div className="flex flex-col">
        <main
          className={`w-full min-h-[calc(100vh-64px)] ${role === undefined ? "mt-32 " : ""}`}
        >
          <ErrorBoundary fallback={<div>an error has occurred</div>}>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

function getNavOptions(role: string) {
  let options: string[] = [];

  switch (role) {
    case "tenant":
      options = [
        "Dashboard",
        "Temperature",
        "Air",
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

  return options;
}

{
  /* <Sheet>
  <SheetTrigger asChild>
    <Button
      variant="outline"
      size="icon"
      className="shrink-0 md:hidden"
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle navigation menu</span>
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="flex flex-col">
    <nav className="grid gap-2 text-lg font-medium">
      <Link
        href="#"
        className="flex items-center gap-2 text-lg font-semibold"
      >
        <Package2 className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      {options.map((option, index) => (
        <Link
          key={index}
          href="#"
          className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
        >
          {/* Add appropriate icons for each option */
}
//           {option}
//         </Link>
//       ))}
//     </nav>
//   </SheetContent>
// </Sheet>
