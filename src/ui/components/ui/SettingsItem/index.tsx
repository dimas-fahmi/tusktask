import type { LucideIcon } from "lucide-react";
import { cn } from "@/src/ui/shadcn/lib/utils";

export interface SettingsItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  destructive?: boolean;
  children?: React.ReactNode;
}

const SettingsItem = ({
  title,
  description,
  icon: Icon,
  children,
  destructive,
}: SettingsItemProps) => {
  return (
    <div
      className={cn(
        "flex justify-between items-center",
        destructive ? "text-destructive" : "",
      )}
    >
      {/* Icon & Title */}
      <div className="flex gap-4">
        {/* Icon */}
        <Icon />

        {/* Title & Description */}
        <div>
          <h1>{title}</h1>
          <p className="text-xs font-light">{description}</p>
        </div>
      </div>

      {/* Controller */}
      <div>{children}</div>
    </div>
  );
};

export default SettingsItem;
