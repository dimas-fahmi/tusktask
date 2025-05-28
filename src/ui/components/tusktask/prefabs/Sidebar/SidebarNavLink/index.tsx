import { useSidebar } from "@/src/ui/components/shadcn/ui/sidebar";
import { LayoutDashboard, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarNavLinkProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({
  href,
  icon,
  label,
}) => {
  // Get current pathname
  const pathname = usePathname();

  // Pull setters from sidebar context
  const { setOpenMobile } = useSidebar();

  // Render Icon
  const Icon = icon;

  return (
    <Link
      href={href}
      className={`${pathname === href ? "bg-accent text-accent-foreground" : "hover:bg-accent/40 hover:text-accent-foreground text-sidebar-foreground"} text-sm px-4 py-2 rounded-md flex items-center gap-2`}
      onClick={() => {
        setOpenMobile(false);
      }}
    >
      <span>
        <Icon className="w-5 h-5 opacity-80" />
      </span>
      <span>{label}</span>
    </Link>
  );
};

export default SidebarNavLink;
