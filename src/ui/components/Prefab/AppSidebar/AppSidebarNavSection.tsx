"use client";

import {
  IconCalendar,
  IconCalendarEvent,
  IconCalendarWeek,
  IconHelpCircle,
  IconLayoutDashboard,
  IconList,
  IconLock,
  IconPlus,
  IconSettings,
} from "@tabler/icons-react";
import route from "@/src/app/route";
import { useNewProject } from "@/src/hooks/useNewProject";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/ui/shadcn/components/ui/dropdown-menu";
import { SidebarNav, type SidebarNavData } from "../../sidebarNav";

const AppSidebarNavSection = () => {
  const setOpenNPD = useNewProject((s) => s.setOpen);

  const SIDEBAR_CONFIG: SidebarNavData = [
    {
      title: "Main",
      key: "main",
      defaultOpen: true,
      items: [
        { icon: IconLayoutDashboard, label: "Dashboard", href: route.app() },
        { icon: IconCalendar, label: "Today", href: route.today() },
        { icon: IconCalendarEvent, label: "Upcoming", href: route.upcoming() },
        { icon: IconCalendarWeek, label: "Calendar", href: route.calendar() },
      ],
    },
    {
      title: "Projects",
      key: "projects",
      defaultOpen: true,
      items: [],
      emptyItemMessage: "No project yet",
      headerButtonSlots: {
        before: (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={(props) => (
                <Button
                  {...props}
                  variant={"ghost"}
                  size={"icon-xs"}
                  className={"p-0"}
                  onClick={(e) => {
                    e.stopPropagation();
                    props?.onClick?.(e);
                  }}
                >
                  <IconPlus />
                </Button>
              )}
            />

            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  setOpenNPD(true);
                }}
              >
                <IconPlus /> <span>New Project</span>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <IconList /> <span>My Projects</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    },
    {
      title: "more",
      key: "more",
      items: [
        { icon: IconSettings, label: "Settings", href: route.settings() },
        { icon: IconLock, label: "Security", href: route.settings("security") },
        { icon: IconHelpCircle, label: "Help", disabled: true },
      ],
    },
  ];

  return <SidebarNav data={SIDEBAR_CONFIG} />;
};

export default AppSidebarNavSection;
