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
  const pathname = usePathname();
  const Icon = icon;

  return (
    <Link
      href={href}
      className={`${pathname === href ? "bg-accent text-accent-foreground" : "hover:bg-accent/20 hover:text-accent"} text-sm px-4 py-2 rounded-md flex items-center gap-2`}
    >
      <span>
        <Icon className="w-5 h-5 opacity-80" />
      </span>
      <span>{label}</span>
    </Link>
  );
};

export default SidebarNavLink;
