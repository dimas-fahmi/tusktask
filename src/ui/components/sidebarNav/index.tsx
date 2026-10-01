"use client";

import {
  IconChevronDown,
  IconHelpCircle,
  type IconProps,
  type TablerIcon,
} from "@tabler/icons-react";
import { cn } from "cn";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { Button, type ButtonProps } from "../../shadcn/components/ui/button";
import { useSidebar } from "../../shadcn/components/ui/sidebar";

export type SidebarNavGroup = {
  title: string;
  items: SidebarNavItem[];
  defaultOpen?: boolean;
};

export type SidebarNavItem = {
  label: string;
  icon?: TablerIcon;
  iconProps?: IconProps;
  href?: string;
  isActive?: boolean;
  iconNode?: React.ReactNode;
} & ButtonProps;

export type SidebarNavData = SidebarNavGroup[];

const SidebarNavItem = ({
  data: {
    icon,
    label,
    href,
    iconProps,
    onClick,
    isActive,
    iconNode: IconNode,
    ...props
  },
}: {
  data: SidebarNavItem;
}) => {
  const Icon = icon ?? IconHelpCircle;
  const { setOpenMobile } = useSidebar();
  const router = useRouter();

  return (
    <Button
      variant={"ghost"}
      {...props}
      className={cn(
        "text-start justify-start disabled:opacity-50 transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          : "not-disabled:hover:bg-foreground/10 opacity-70",
        props?.className,
      )}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;

        if (href) {
          router.push(href);
        }

        setOpenMobile(false);
      }}
    >
      {IconNode
        ? IconNode
        : Icon && (
            <Icon {...iconProps} className={cn("", iconProps?.className)} />
          )}
      <span>{label}</span>
    </Button>
  );
};

const SidebarNavGroup = ({ data }: { data: SidebarNavGroup }) => {
  const [expand, setExpand] = useState(!!data?.defaultOpen);

  return (
    <div>
      <div className="flex items-center justify-between ps-1">
        <h1 className="text-xs uppercase opacity-80 font-light">
          {data.title}
        </h1>

        <Button
          variant={"ghost"}
          onClick={() => {
            setExpand((prev) => !prev);
          }}
          size={"icon-sm"}
          className={"p-0"}
        >
          <IconChevronDown
            className={cn(
              "transition-all duration-300",
              expand ? "rotate-180" : "",
            )}
          />
        </Button>
      </div>

      <motion.div
        initial={
          data?.defaultOpen
            ? { height: "auto", scale: 1, opacity: 1 }
            : { height: 0, scale: 0.95, opacity: 0.7 }
        }
        animate={
          expand
            ? { height: "auto", scale: 1, opacity: 1 }
            : { height: 0, scale: 0.95, opacity: 0.7 }
        }
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 gap-1">
          {data.items.map((item) => (
            <SidebarNavItem key={crypto.randomUUID()} data={item} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const SidebarNav = ({ data }: { data: SidebarNavData }) => {
  return (
    <div className="space-y-2">
      {data.map((group) => (
        <SidebarNavGroup key={crypto.randomUUID()} data={group} />
      ))}
    </div>
  );
};

export { SidebarNav, SidebarNavGroup, SidebarNavItem };
