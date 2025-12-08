import { Circle, CircleCheck } from "lucide-react";
import Image from "next/image";
import { cn } from "@/src/ui/shadcn/lib/utils";

const ColorThemeCard = ({
  title,
  description,
  screenshot,
  active,
  onClick,
  disabled,
  className,
}: {
  title: string;
  description: string;
  screenshot: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  const Icon = active ? CircleCheck : Circle;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        `space-y-2 text-left p-2 rounded-xl group/card cursor-pointer hover:scale-95 active:scale-90 border transition-all duration-300 ${disabled ? "opacity-50 pointer-events-none" : ""}`,
        className,
      )}
    >
      {/* Image */}
      <div className="relative">
        <Image
          width={1360}
          height={768}
          src={screenshot}
          alt={`${title}'s screenshot`}
          className={`object-contain rounded-xl`}
        />
      </div>

      {/* Metadata */}
      <div className="transition-all duration-300 py-2 space-y-3">
        <h1>{title}</h1>
        <p className="text-xs font-light">{description}</p>

        {/* Status */}
        <div
          className={`flex justify-center items-center gap-2 rounded-xl px-4 py-2 text-xs ${active ? "bg-success rounded-md text-success-foreground" : "bg-muted text-muted-foreground"}`}
        >
          <Icon className="w-4 h-4" /> {active ? "Active" : "Inactive"}
        </div>
      </div>
    </button>
  );
};

export default ColorThemeCard;
