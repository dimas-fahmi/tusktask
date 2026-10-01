"use client";

import {
  IconCalendar,
  IconCalendarEvent,
  IconCalendarWeek,
  IconHelpCircle,
  IconLayoutDashboard,
  IconLock,
  IconPlus,
  IconSettings,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import route from "@/src/app/route";
import { stripLocaleFromPathname } from "@/src/i18n";
import { Avatar, AvatarFallback } from "@/src/ui/shadcn/components/ui/avatar";
import { SidebarNav, type SidebarNavData } from "../../sidebarNav";

const useCreateSidebarNav = (): SidebarNavData => {
  const pathname = stripLocaleFromPathname(usePathname());

  return [
    // Main
    {
      title: "Main",
      items: [
        {
          icon: IconLayoutDashboard,
          label: "Dashboard",
          href: route.app(),
          isActive: pathname === route.app(),
        },
        {
          icon: IconCalendar,
          label: "Today",
          href: route.today(),
          isActive: pathname === route.today(),
        },
        {
          icon: IconCalendarEvent,
          label: "Upcoming",
          href: route.upcoming(),
          isActive: pathname === route.upcoming(),
        },
        {
          icon: IconCalendarWeek,
          label: "Calendar",
          href: route.calendar(),
          isActive: pathname === route.calendar(),
        },
      ],
      defaultOpen: true,
    },

    // Projects
    {
      title: "Projects",
      items: [
        {
          iconNode: (
            <div
              className={
                "w-6 h-6 flex items-center justify-center bg-muted border rounded-full"
              }
            >
              <IconPlus className="w-3 h-3" />
            </div>
          ),
          label: "New Project",
        },
        {
          iconNode: (
            <Avatar className={"w-6 h-6"}>
              <AvatarFallback className={"text-[10px]"}>M</AvatarFallback>
            </Avatar>
          ),
          label: "My Project",
        },
      ],
      defaultOpen: true,
    },
    {
      title: "more",
      items: [
        {
          icon: IconSettings,
          label: "Settings",
          href: route.settings(),
          isActive: pathname === route.settings(),
        },
        {
          icon: IconLock,
          label: "Security",
          href: route.settings("security"),
          isActive: pathname === route.settings("security"),
        },
        {
          icon: IconHelpCircle,
          label: "Help",
          disabled: true,
        },
      ],
      defaultOpen: [route.settings(), route.settings("security")].includes(
        pathname,
      ),
    },
  ];
};

const AppSidebarNavSection = () => {
  const data = useCreateSidebarNav();

  return <SidebarNav data={data} />;
};
export default AppSidebarNavSection;
