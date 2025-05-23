import {
  AlarmClock,
  Calendar1,
  CalendarArrowUp,
  CalendarClock,
  CalendarFold,
  FolderGit2,
  LayoutDashboard,
} from "lucide-react";
import { Separator } from "../../../shadcn/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../../../shadcn/ui/sidebar";
import HeaderNavigation from "../Sidebar/HeaderNavigation";
import SidebarNavLink from "../Sidebar/SidebarNavLink";
import UserProfileCard from "../UserProfileCard";

const navigationLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Today",
    href: "/dashboard/tasks/filter/today",
    icon: Calendar1,
  },
  {
    label: "Tomorrow",
    href: "/dashboard/tasks/filter/tomorrow",
    icon: CalendarArrowUp,
  },
  {
    label: "Upcoming",
    href: "/dashboard/tasks/filter/upcoming",
    icon: CalendarFold,
  },
  {
    label: "Overdue",
    href: "/dashboard/tasks/filter/overdue",
    icon: CalendarClock,
  },
  {
    label: "Pomodoro",
    href: "/dashboard/pomodoro",
    icon: AlarmClock,
  },
  {
    label: "My Teams",
    href: "/dashboard/teams",
    icon: FolderGit2,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="">
      {/* Sidebar Header */}
      <SidebarHeader className="p-2 pt-4">
        <UserProfileCard />
        <HeaderNavigation />
        <Separator className="mt-3" />
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="p-2">
        {navigationLinks.map((nav, index) => (
          <SidebarNavLink
            icon={nav.icon}
            label={nav.label}
            href={nav.href}
            key={index}
          />
        ))}
      </SidebarContent>

      {/* SidebarFooter */}
      <SidebarFooter />
    </Sidebar>
  );
}
