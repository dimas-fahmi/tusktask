"use client";

import {
  LayoutDashboard,
  ListTodo,
  Logs,
  type LucideIcon,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const NavItem = ({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
}) => {
  return (
    <Button variant={isActive ? "default" : "outline"} asChild>
      <Link href={href} scroll={false}>
        {/* Icon */}
        <span>
          <Icon className="w-5 h-5" />
        </span>

        {/* Label */}
        <span>{label}</span>
      </Link>
    </Button>
  );
};

const NavigationBar = () => {
  const params = useSearchParams();
  const tab = params.get("tab");

  return (
    <div className="flex items-center gap-2 overflow-x-scroll scrollbar-none">
      {/* Overview */}
      <NavItem
        href="?tab=overview"
        isActive={tab === "overview" || !tab}
        icon={LayoutDashboard}
        label="Overview"
      />

      {/* Task */}
      <NavItem
        href="?tab=tasks"
        isActive={tab === "tasks"}
        icon={ListTodo}
        label="Tasks"
      />

      {/* Task */}
      <NavItem
        href="?tab=members"
        isActive={tab === "members"}
        icon={Users}
        label="Members"
      />

      {/* Task */}
      <NavItem
        href="?tab=logs"
        isActive={tab === "logs"}
        icon={Logs}
        label="Logs"
      />

      {/* Task */}
      <NavItem
        href="?tab=settings"
        isActive={tab === "settings"}
        icon={Settings}
        label="Settings"
      />
    </div>
  );
};

export default NavigationBar;
