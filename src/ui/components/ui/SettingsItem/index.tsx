import type { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/src/ui/shadcn/lib/utils";

export interface SettingsItemClassNames {
  container?: string;
  iconTitleContainer?: string;
  titleDescriptionContainer?: string;
  title?: string;
  description?: string;
  childrenContainer?: string;
}

export interface SettingsItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  destructive?: boolean;
  children?: React.ReactNode;
  classNames?: SettingsItemClassNames;
  iconProps?: LucideProps;
}

const SettingsItem = ({
  title,
  description,
  icon: Icon,
  children,
  destructive,
  classNames,
  iconProps,
}: SettingsItemProps) => {
  return (
    <div
      className={cn(
        "flex justify-between items-center",
        destructive ? "text-destructive" : "",
        classNames?.container,
      )}
    >
      {/* Icon & Title */}
      <div className={cn("flex gap-4", classNames?.iconTitleContainer)}>
        {/* Icon */}
        <Icon {...iconProps} />

        {/* Title & Description */}
        <div className={cn("", classNames?.titleDescriptionContainer)}>
          <h1 className={cn("", classNames?.title)}>{title}</h1>
          <p className={cn("text-xs font-light", classNames?.description)}>
            {description}
          </p>
        </div>
      </div>

      {/* Children */}
      <div className={cn("", classNames?.childrenContainer)}>{children}</div>
    </div>
  );
};

export default SettingsItem;
