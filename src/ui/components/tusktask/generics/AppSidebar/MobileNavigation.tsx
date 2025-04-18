import Link from "next/link";
import React from "react";

import {
  Calendar1,
  CalendarArrowUp,
  CircleEllipsis,
  LayoutDashboard,
} from "lucide-react";
import { useSidebar } from "../../../shadcn/ui/sidebar";

const mobileNavigations = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
  { title: "Today", icon: Calendar1, url: "/dashboard/tasks/today" },
  {
    title: "Tomorrow",
    icon: CalendarArrowUp,
    url: "/dashboard/tasks/tomorrow",
  },
];

const MobileNavigation = () => {
  const { setOpenMobile } = useSidebar();

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-tt-secondary text-sm text-tt-secondary-foreground p-4 grid grid-cols-4">
      {mobileNavigations.map((nav, index) => (
        <Link
          href={nav.url}
          className="flex flex-col items-center gap-1.5"
          key={index}
        >
          <span>
            <nav.icon size={"20px"} />
          </span>
          <span>{nav.title}</span>
        </Link>
      ))}
      <button
        className="flex flex-col items-center gap-1.5"
        onClick={() => setOpenMobile(true)}
      >
        <span>
          <CircleEllipsis size={"20px"} />
        </span>
        <span>Dashboard</span>
      </button>
    </nav>
  );
};

export default MobileNavigation;
