import {
  Bell,
  Calendar1,
  CalendarArrowUp,
  CalendarClock,
  CalendarX,
  FolderIcon,
  LayoutDashboardIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/src/ui/shadcn/components/ui/sidebar";
import { cn } from "@/src/ui/shadcn/lib/utils";

export type NavigationData = {
  icon: LucideIcon;
  title: string;
  href: string;
};

export const navigationDatas: NavigationData[] = [
  { title: "Dashboard", icon: LayoutDashboardIcon, href: "/dashboard" },
  { title: "Notifications", icon: Bell, href: "/dashboard/notifications" },
  {
    title: "Today",
    icon: Calendar1,
    href: "/dashboard/tasks?collection=today",
  },
  {
    title: "Tomorrow",
    icon: CalendarArrowUp,
    href: "/dashboard/tasks?collection=tomorrow",
  },
  {
    title: "Upcoming",
    icon: CalendarClock,
    href: "/dashboard/tasks?collection=upcoming",
  },
  {
    title: "Overdue",
    icon: CalendarX,
    href: "/dashboard/tasks?collection=overdue",
  },
  {
    title: "Projects",
    icon: FolderIcon,
    href: "/dashboard/projects",
  },
];

const NavigationItem = ({
  data: { href, icon: Icon, title },
}: {
  data: NavigationData;
}) => {
  const { isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      onClick={() => {
        if (isMobile) {
          setOpenMobile(false);
        }
      }}
      href={href}
      className={cn(
        `flex gap-2 items-center p-2 rounded-xl transition-all duration-300 ${isActive ? "bg-primary text-primary-foreground opacity-100 px-4" : "hover:bg-secondary hover:text-secondary-foreground px-2"} hover:scale-95 active:scale-90 opacity-90`,
      )}
    >
      <Icon className="w-5 h-5" /> {title}
    </Link>
  );
};

const Navigations = () => {
  return (
    <section className="space-y-1">
      {navigationDatas.map((data) => (
        <NavigationItem key={crypto.randomUUID()} {...{ data }} />
      ))}
    </section>
  );
};

export default Navigations;
