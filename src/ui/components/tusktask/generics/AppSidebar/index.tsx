"use client";

import {
  Activity,
  BadgePlus,
  Calendar1,
  CalendarArrowUp,
  CalendarClock,
  CalendarX2,
  Folder,
  LayoutDashboard,
  Settings,
  SidebarClose,
  Timer,
  Trash,
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
  useSidebar,
} from "../../../shadcn/ui/sidebar";

import { SidebarHeader as SidebarTTHeader } from "./SidebarHeader";

import Link from "next/link";
import { cn } from "@/src/lib/shadcn/utils";
import { usePathname, useRouter } from "next/navigation";
import StatusOverview from "../StatusOverview";
import { Button } from "../../../shadcn/ui/button";
import useTasksContext from "@/src/lib/tusktask/hooks/context/useTasksContext";
import { formatTime } from "@/src/lib/tusktask/utils/format/formatTIme";
import usePomodoroContext from "@/src/lib/tusktask/hooks/context/usePomodoroContext";
import { Separator } from "../../../shadcn/ui/separator";

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
  {
    title: "Pomodoro",
    url: "/dashboard/pomodoro     ",
    icon: Timer,
  },
  {
    title: "Activity Logs",
    url: "/dashboard/logs",
    icon: Activity,
  },
  {
    title: "Trash Bin",
    url: "/dashboard/trash",
    icon: Trash,
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
  // Pull Setters from sidebar context
  const { setOpenMobile, setOpen } = useSidebar();

  // Pull setters and text from task context
  const { setNewTaskDialogOpen, overdue, today, tomorrow, upcoming } =
    useTasksContext();

  // Pull states from pomodoro context
  const { time, isRunning, cycle } = usePomodoroContext();

  // Initialized Router
  const router = useRouter();

  return (
    <Sidebar>
      <SidebarHeader className="pt-6 space-y-2 ">
        <SidebarTTHeader />
        <div className="md:hidden">
          <StatusOverview
            overdue={overdue.length}
            today={today.length}
            upcoming={tomorrow.length + upcoming.length}
          />
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-1">
            <Button
              onClick={() => setNewTaskDialogOpen(true)}
              variant={"default"}
              size={"sm"}
            >
              <BadgePlus size={"20px"} />
              New Task
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant={"outline"} size={"sm"}>
              <Settings size={"20px"} />
              Settings
            </Button>
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => {
                setOpenMobile(false);
                setOpen(false);
              }}
            >
              <SidebarClose size={"20px"} />
              Hide Menu
            </Button>
          </div>
          {isRunning && (
            <div
              className="p-4 border rounded-md shadow-xl cursor-pointer hover:shadow-2xl"
              onClick={() => router.push("/dashboard/pomodoro")}
              title="Click to open Pomodoro page."
            >
              <span className="flex items-center gap-0.5 justify-center text-xs">
                <Timer className="w-4 h-4" />
                Pomodoro Timer
              </span>
              <span className="text-center text-xl font-bold flex items-center justify-center">
                {formatTime(time)}
              </span>
              <Separator className="mt-2" />
              <span className="text-sm flex justify-center mt-2 uppercase font-bold">
                {cycle}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={`${isRunning && "pb-16"}`}>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  onClick={() => setOpenMobile(false)}
                >
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
