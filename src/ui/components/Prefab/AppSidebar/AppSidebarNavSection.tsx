"use client";

import { IconList, IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import route from "@/src/app/route";
import { useNewProject } from "@/src/hooks/useNewProject";
import { useTRPC } from "@/src/lib/trpc/client/client";
import ProjectNavContextMenu from "@/src/ui/context-menu/ProjectNavContextMenu";
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
  const t = useTranslations();
  const setOpenNPD = useNewProject((s) => s.setOpen);

  const router = useRouter();

  const trpc = useTRPC();

  const { data: myProjects } = useQuery({
    ...trpc.project.get.queryOptions({}),
  });

  const myProjectsNav: SidebarNavItem[] = (myProjects ?? []).flatMap(
    (value) => ({
      label: value.name,
      iconName: (value?.iconId as IconName) ?? "folder",
      href: route.project(value.id),
      contextMenuContent: <ProjectNavContextMenu data={value} />,
    }),
  );

  const SIDEBAR_CONFIG: SidebarNavData = [
    {
      title: t("common.main"),
      key: "main",
      defaultOpen: true,
      items: [
        {
          iconName: "dashboard",
          label: t("common.dashboard"),
          href: route.app(),
        },
        {
          iconName: "calendar",
          label: t("common.today"),
          href: route.today(),
        },
        {
          iconName: "calendar_event",
          label: t("common.upcoming"),
          href: route.upcoming(),
        },
        {
          iconName: "calendar_week",
          label: t("common.calendar"),
          href: route.calendar(),
        },
      ],
    },
    {
      title: t("common.projects"),
      key: "projects",
      defaultOpen: true,
      items: myProjectsNav,
      emptyItemMessage: t("common.no_projects_yet"),
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
                <IconPlus /> <span>{t("common.new_project")}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  router.push(route.myProjects());
                }}
              >
                <IconList /> <span>{t("common.my_projects")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    },
    {
      title: t("common.more"),
      key: "more",
      items: [
        {
          iconName: "settings",
          label: t("common.settings"),
          href: route.settings(),
        },
        {
          iconName: "lock",
          label: t("common.security"),
          href: route.settings("security"),
        },
        { iconName: "help", label: t("common.support"), disabled: true },
      ],
    },
  ];

  return <SidebarNav data={SIDEBAR_CONFIG} />;
};

export default AppSidebarNavSection;
