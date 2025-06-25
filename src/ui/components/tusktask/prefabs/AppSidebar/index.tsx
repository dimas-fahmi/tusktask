import {
  Calendar1,
  CalendarArrowUp,
  CalendarClock,
  CalendarFold,
  FolderGit2,
  LayoutDashboard,
  MessageSquareText,
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
import {
  MESSAGES_PAGE_INDEX,
  TASKS_PAGE_FILTER,
  TEAMS_PAGE_INDEX,
} from "@/src/lib/tusktask/constants/configs";

const navigationLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Messages",
    href: MESSAGES_PAGE_INDEX,
    icon: MessageSquareText,
  },
  {
    label: "Today",
    href: `${TASKS_PAGE_FILTER}/today`,
    icon: Calendar1,
  },
  {
    label: "Tomorrow",
    href: `${TASKS_PAGE_FILTER}/tomorrow`,
    icon: CalendarArrowUp,
  },
  {
    label: "Upcoming",
    href: `${TASKS_PAGE_FILTER}/upcoming`,
    icon: CalendarFold,
  },
  {
    label: "Overdue",
    href: `${TASKS_PAGE_FILTER}/overdue`,
    icon: CalendarClock,
  },
  {
    label: "My Teams",
    href: TEAMS_PAGE_INDEX,
    icon: FolderGit2,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="!text-sidebar-foreground">
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
