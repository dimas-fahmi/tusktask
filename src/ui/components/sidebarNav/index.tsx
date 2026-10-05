"use client";

import { IconChevronDown, type IconProps } from "@tabler/icons-react";
import { cn } from "cn";
import Cookies from "js-cookie";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { memo, useEffect, useRef, useState } from "react";
import { stripLocaleFromPathname } from "@/src/i18n";
import { Button, type ButtonProps } from "../../shadcn/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "../../shadcn/components/ui/context-menu";
import { useSidebar } from "../../shadcn/components/ui/sidebar";
import IconRenderer from "../IconRenderer";
import type { IconName } from "../IconRenderer/collections";

export type SidebarNavGroup = {
  title: string;
  items: SidebarNavItem[];
  key: string;
  defaultOpen?: boolean;
  headerButtonSlots?: {
    before?: React.ReactNode;
    after?: React.ReactNode;
  };
  emptyItemMessage?: string;
  emptyItemNode?: React.ReactNode;
};

export type SidebarNavItem = {
  label: string;
  iconName?: IconName;
  iconProps?: IconProps;
  href?: string;
  isActive?: boolean;
  iconNode?: React.ReactNode;
  textIcon?: string;
  contextMenuContent?: React.ReactNode;
} & ButtonProps;

export type SidebarNavData = SidebarNavGroup[];

const SidebarNavIconContainer = ({
  textIcon,
  className,
  isActive,
  icoName,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
  icoName?: IconName;
  textIcon?: string;
  isActive: boolean;
}) => {
  return (
    <div
      {...props}
      className={cn(
        "min-w-7 max-w-7 min-h-7 max-h-7 rounded-full flex items-center justify-center border",
        isActive
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {(textIcon && <span className="text-[13px]">{textIcon?.[0]}</span>) ?? (
        <IconRenderer iconName={icoName} className="w-4 h-4" />
      )}
    </div>
  );
};

const SidebarNavItem = memo(({ data }: { data: SidebarNavItem }) => {
  const {
    label,
    href,
    iconProps,
    onClick,
    iconNode,
    textIcon,
    iconName,
    contextMenuContent,
    ...props
  } = data;
  const { setOpenMobile } = useSidebar();
  const router = useRouter();

  const pathname = stripLocaleFromPathname(usePathname());
  const isActive = href ? pathname === href : false;

  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={(contextMenuProps) => (
          <Button
            {...contextMenuProps}
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
            {iconNode ? (
              iconNode
            ) : (
              <SidebarNavIconContainer
                isActive={isActive}
                icoName={iconName}
                textIcon={textIcon}
              />
            )}
            <span>{label}</span>
          </Button>
        )}
      />

      {contextMenuContent && (
        <ContextMenuContent>{contextMenuContent}</ContextMenuContent>
      )}
    </ContextMenu>
  );
});
SidebarNavItem.displayName = "SidebarNavItem";

const SidebarNavGroup = memo(({ data }: { data: SidebarNavGroup }) => {
  const pathname = stripLocaleFromPathname(usePathname());

  const expandButtonRef = useRef<HTMLButtonElement>(null);

  const hasActiveChild = data.items.some(
    (item) => item.href && pathname === item.href,
  );

  const stored = Cookies.get(`SidebarNavGroupExpand-${data.key}`);

  const [expand, setExpand] = useState(() => {
    if (!stored) {
      return data.defaultOpen || hasActiveChild;
    }

    return stored === "true";
  });

  useEffect(() => {
    Cookies.set(`SidebarNavGroupExpand-${data.key}`, `${expand}`);
  }, [expand, data.key]);

  useEffect(() => {
    if (hasActiveChild) {
      setExpand(true);
    }
  }, [hasActiveChild]);

  return (
    <div className="space-y-1.5">
      <div
        className="flex items-center justify-between ps-1 cursor-pointer"
        onClick={() => {
          expandButtonRef?.current?.click();
        }}
      >
        <h1 className="text-xs uppercase opacity-80 font-light select-none">
          {data.title}
        </h1>

        <div className="flex items-center">
          {data?.headerButtonSlots?.before}

          <Button
            ref={expandButtonRef}
            variant={"ghost"}
            onClick={(e) => {
              e.stopPropagation();
              setExpand((prev) => !prev);
            }}
            size={"icon-xs"}
            className={"p-0"}
          >
            <IconChevronDown
              suppressHydrationWarning
              className={cn(
                "transition-all duration-300",
                expand ? "rotate-180" : "",
              )}
            />
          </Button>

          {data?.headerButtonSlots?.after}
        </div>
      </div>

      <motion.div
        suppressHydrationWarning
        initial={
          stored === "true" || data?.defaultOpen || hasActiveChild
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
          {data.items.length
            ? data.items.map((item) => (
                <SidebarNavItem key={item.label} data={item} />
              ))
            : (data?.emptyItemNode ?? (
                <span className="text-xs font-light w-full text-center opacity-50 p-4">
                  {data?.emptyItemMessage}
                </span>
              ))}
        </div>
      </motion.div>
    </div>
  );
});
SidebarNavGroup.displayName = "SidebarNavGroup";

const SidebarNav = memo(({ data }: { data: SidebarNavData }) => {
  return (
    <div className="space-y-2">
      {data.map((group) => (
        <SidebarNavGroup key={group.title} data={group} />
      ))}
    </div>
  );
});

SidebarNav.displayName = "SidebarNav";

export { SidebarNav, SidebarNavGroup, SidebarNavItem };
