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
  IconTemperature,
} from "@tabler/icons-react";
import route from "@/src/app/route";
import { SidebarNav, type SidebarNavData } from "../../sidebarNav";

// 1. Static Configuration: Created once, never triggers a re-render.
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
    items: [
      {
        icon: IconPlus,
        label: "New Project",
      },
      { textIcon: "M", label: "My Project" },
      { icon: IconTemperature, label: "Chemistry" },
    ],
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

const AppSidebarNavSection = () => {
  return <SidebarNav data={SIDEBAR_CONFIG} />;
};

export default AppSidebarNavSection;
