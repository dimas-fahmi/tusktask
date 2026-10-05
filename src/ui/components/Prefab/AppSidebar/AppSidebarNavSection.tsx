"use client";

import { IconList, IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import route from "@/src/app/route";
import { useNewProject } from "@/src/hooks/useNewProject";
import { useTRPC } from "@/src/lib/trpc/client/client";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/ui/shadcn/components/ui/dropdown-menu";
import type { IconName } from "../../IconRenderer/collections";
import {
  SidebarNav,
  type SidebarNavData,
  type SidebarNavItem,
} from "../../sidebarNav";

const AppSidebarNavSection = () => {
  const setOpenNPD = useNewProject((s) => s.setOpen);

  const trpc = useTRPC();

  const { data: myProjects } = useQuery({
    ...trpc.project.get.queryOptions({}),
  });

  const myProjectsNav: SidebarNavItem[] = (myProjects ?? []).flatMap(
    (value) => ({
      label: value.name,
      iconName: (value?.iconId as IconName) ?? "folder",
    }),
  );

  const SIDEBAR_CONFIG: SidebarNavData = [
    {
      title: "Main",
      key: "main",
      defaultOpen: true,
      items: [
        { iconName: "dashboard", label: "Dashboard", href: route.app() },
        { iconName: "calendar", label: "Today", href: route.today() },
        {
          iconName: "calendar_event",
          label: "Upcoming",
          href: route.upcoming(),
        },
        {
          iconName: "calendar_week",
          label: "Calendar",
          href: route.calendar(),
        },
      ],
    },
    {
      title: "Projects",
      key: "projects",
      defaultOpen: true,
      items: myProjectsNav,
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
        { iconName: "settings", label: "Settings", href: route.settings() },
        {
          iconName: "lock",
          label: "Security",
          href: route.settings("security"),
        },
        { iconName: "help", label: "Help", disabled: true },
      ],
    },
  ];

  return <SidebarNav data={SIDEBAR_CONFIG} />;
};

export default AppSidebarNavSection;
