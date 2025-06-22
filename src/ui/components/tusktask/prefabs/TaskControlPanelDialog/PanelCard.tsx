import { LucideIcon } from "lucide-react";
import React from "react";

export interface PanelCard {
  label: string;
  Icon: LucideIcon;
  className?: string;
  onClick?: () => void;
}

const PanelCard = ({
  label,
  Icon,
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & PanelCard) => {
  return (
    <button
      className="flex flex-col gap-2 justify-center items-center p-3 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all duration-300 active:scale-90"
      onClick={onClick}
      {...props}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs">{label}</span>
    </button>
  );
};

export default PanelCard;
