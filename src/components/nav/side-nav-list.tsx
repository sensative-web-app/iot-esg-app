"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { MdOutlineSensors } from "react-icons/md";
import {
  MdDashboard,
  MdThermostat,
  MdCo2,
  MdElectricalServices,
  MdDevices,
  MdSettings,
} from "react-icons/md";

export function SideNavList({ options }: { options: string[] }) {
  const currentPath = usePathname();
  const iconMap: Record<string, React.ReactNode> = {
    Dashboard: <MdDashboard />,
    Temperature: <MdThermostat />,
    Co2: <MdCo2 />,
    Electricity: <MdElectricalServices />,
    Nodes: <MdDevices />,
    Settings: <MdSettings />,
  };

  return (
    <nav className="pt-2  grid gap-1">
      {options.map((option, index) => {
        const isActive =
          (option.toLowerCase() === "dashboard" && currentPath === "/") ||
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
            <div className="text-lg">
              {iconMap[option] || <MdOutlineSensors />}{" "}
            </div>

            {option}
          </Link>
        );
      })}
    </nav>
  );
}
