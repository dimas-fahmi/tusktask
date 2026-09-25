import { IconChevronRight, type TablerIcon } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "@/src/ui/shadcn/lib/utils";

export type SettingBlockProps = {
  title?: string;
} & React.ComponentPropsWithRef<"div">;

const Setting = React.forwardRef<HTMLDivElement, SettingBlockProps>(
  ({ children, className, title, ...props }, ref) => {
    return (
      <div ref={ref} {...props} className="space-y-2">
        {title && (
          <header className="text-xs opacity-50">
            <h1>{title}</h1>
          </header>
        )}

        <div className={cn("bg-card px-1 py-2 space-y-1.5 border rounded-xl")}>
          {children}
        </div>
      </div>
    );
  },
);

Setting.displayName = "Setting Block";

const settingItemVariant = cva(
  "relative flex justify-between gap-3 py-3 px-2 w-full after:absolute after:-bottom-1 after:left-10 after:right-10 after:h-[1px] after:bg-border after:content-[''] last:after:hidden",
  {
    variants: {
      variant: {
        default:
          "**:data-[slot=setting-item-info-icon]:bg-muted **:data-[slot=setting-item-info-icon]:text-muted-foreground ",
        destructive:
          "destructive text-destructive **:data-[slot=setting-item-info-icon]:bg-destructive/10 **:data-[slot=setting-item-info-icon]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type SettingItemProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof settingItemVariant>;

const SettingItem = ({
  className,
  children,
  variant,
  ...props
}: SettingItemProps) => {
  return (
    <div
      {...props}
      className={cn(settingItemVariant({ variant }), "rounded-none", className)}
    >
      {children}
    </div>
  );
};

export type SettingItemInfoProps = {
  icon?: TablerIcon;
  name?: string;
} & Omit<React.ComponentPropsWithoutRef<"div">, "children">;

export type SettingItemButtonProps = React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof settingItemVariant>;

const SettingItemButton = ({
  className,
  children,
  variant,
  ...props
}: SettingItemButtonProps) => {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        settingItemVariant({ variant }),
        "rounded-xl outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 hover:bg-foreground/10 [.destructive]:hover:bg-destructive/10 [.destructive]:hover:text-destructive",
        className,
      )}
    >
      {children}
    </button>
  );
};

const SettingItemInfo = ({
  icon: Icon,
  name,
  className,
  ...props
}: SettingItemInfoProps) => {
  return (
    <div className={cn("flex flex-1 items-center gap-2", className)} {...props}>
      {Icon && (
        <div
          data-slot="setting-item-info-icon"
          className="p-1.5 rounded-full w-7 h-7 flex items-center justify-center"
        >
          <Icon className="w-4 h-4" />
        </div>
      )}
      <span className="opacity-75">{name ?? "Name"}</span>
    </div>
  );
};

const SettingItemAction = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      {...props}
      className={cn("flex items-center justify-center", className)}
    >
      {children}
    </div>
  );
};

export type RenderBlockProps = {
  title?: string;
  items?: React.FC[];
};

const RenderBlock = ({ title, items = [] }: RenderBlockProps) => {
  return (
    <Setting title={title}>
      {items.map((Item) => (
        <Item key={crypto.randomUUID()} />
      ))}
    </Setting>
  );
};

const SettingChevronRight = () => {
  return <IconChevronRight className="w-4 h-4 opacity-50" />;
};

export {
  Setting,
  SettingItem,
  SettingItemInfo,
  SettingItemAction,
  RenderBlock,
  SettingChevronRight,
  SettingItemButton,
};
