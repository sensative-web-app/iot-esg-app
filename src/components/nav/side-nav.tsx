"use client";

import Link from "next/link";
import { Menu, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ReactQueryClientProvider } from "../query-provider";
import { SessionData } from "@/lib/session";
import { usePathname } from "next/navigation";

export function SideNav({
  options,
  children,
  session,
}: {
  options: string[];
  children: React.ReactNode;
  session: string | undefined;
}) {
  const currentPath = usePathname();

  return (
    <div
      className={`grid w-full ${session !== undefined ? "md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]" : ""}`}
    >
      {session !== undefined && (
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex flex-col gap-2">
            <div className="flex-1">
              <nav className="grid items-start px-2 pt-1 text-sm font-medium lg:px-4">
                {options.map((option, index) => {
                  const isActive =
                    (option.toLowerCase() === "dashboard" &&
                      currentPath === "/") ||
                    (option.toLowerCase() !== "dashboard" &&
                      currentPath === `/${option.toLowerCase()}`);

                  return (
                    <Link
                      key={index}
                      href={
                        option.toLowerCase() === "dashboard"
                          ? "/"
                          : `/${option.toLowerCase()}`
                      }
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all ${
                        isActive
                          ? "bg-muted text-primary"
                          : "hover:bg-muted hover:text-primary"
                      }`}
                    >
                      {/* Add appropriate icons for each option */}
                      {option}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="mt-auto p-4"></div>
          </div>
        </div>
      )}
      <div className="flex flex-col">
        <Sheet>
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
                  {/* Add appropriate icons for each option */}
                  {option}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <ReactQueryClientProvider>
          <main
            className={`w-full min-h-[calc(100vh-64px)] ${session === undefined ? "mt-32 " : ""}`}
          >
            {children}
          </main>
        </ReactQueryClientProvider>
      </div>
    </div>
  );
}
