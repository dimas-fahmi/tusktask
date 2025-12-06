import type { LucideIcon } from "lucide-react";

export interface SettingsItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}

const SettingsItem = ({
  title,
  description,
  icon: Icon,
  children,
}: SettingsItemProps) => {
  return (
    <div className="flex justify-between items-center">
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
