"use client";

import {
  BadgePlus,
  Calendar1,
  CalendarArrowUp,
  CalendarClock,
  CalendarX2,
  Folder,
  LayoutDashboard,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "../../../shadcn/ui/sidebar";

import { SidebarHeader as SidebarTTHeader } from "./SidebarHeader";

import Link from "next/link";
import { cn } from "@/src/lib/shadcn/utils";
import { usePathname } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Today",
    url: "/dashboard/tasks/today",
    icon: Calendar1,
  },
  {
    title: "Tomorrow",
    url: "/dashboard/tasks/tomorrow",
    icon: CalendarArrowUp,
  },
  {
    title: "Upcoming",
    url: "/dashboard/tasks/upcoming",
    icon: CalendarClock,
  },
  {
    title: "Overdue",
    url: "/dashboard/tasks/overdue",
    icon: CalendarX2,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: Folder,
  },
];

const NavLink = ({
  title,
  url,
  icon,
  className = "",
  number,
}: {
  title: string;
  url: string;
  className?: string;
  icon: React.ReactNode;
  number?: number | null;
}) => {
  const pathname = usePathname();

  return (
    <Link
      href={url}
      title={title}
      className={cn(
        `${pathname === url ? "bg-tt-secondary/20 text-tt-secondary hover:!bg-tt-secondary/20 hover:!text-tt-secondary" : "hover:!bg-tt-secondary/5 hover:!text-tt-secondary"} flex justify-between items-center !transition-all !duration-300`,
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <span>{icon}</span>
        <span className="text-sm">{title}</span>
      </div>
      <div className="text-xs">{number}</div>
    </Link>
  );
};

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="pt-6">
        <div className="flex justify-end md:hidden">
          <SidebarTrigger />
        </div>
        <SidebarTTHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <button className="flex items-center gap-2 bg-tt-secondary px-4 py-2 text-tt-secondary-foreground rounded-md text-sm justify-center cursor-pointer hover:bg-tt-secondary/80">
            <BadgePlus size={"20px"} />
            New Task
          </button>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      title={item.title}
                      url={item.url}
                      icon={<item.icon size={"16px"} />}
                    />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
