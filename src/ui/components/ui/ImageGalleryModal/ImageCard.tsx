/** biome-ignore-all lint/a11y/useKeyWithClickEvents: temporary */
import { Check, EllipsisIcon } from "lucide-react";
import Image from "next/image";
import type { ImageType } from "@/src/db/schema/image";
import { truncateString } from "@/src/lib/utils/truncateString";
import { cn } from "@/src/ui/shadcn/lib/utils";

const ImageCard = ({
  image,
  onClick,
  active,
}: {
  image: ImageType;
  onClick?: () => void;
  active?: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        `group/card relative max-w-[180px] cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 `,
      )}
    >
      {/* Image Container */}
      <div className="aspect-square rounded-2xl relative overflow-hidden">
        <Image
          layout={"fill"}
          src={image.url}
          alt={image.name}
          className="rounded-2xl group-hover/card:brightness-50 transition-all duration-300"
        />

        {/* Selected */}
        <div
          className={cn(
            `absolute inset-0 bg-black/80 ${active ? "opacity-100" : "opacity-0"} transition-all duration-300 flex-center`,
          )}
        >
          <Check className="text-white w-7 h-7" />
        </div>
      </div>

      {/* Metadata Container */}
      <div className="min-h-13 max-h-13">
        <h1>{truncateString(image.name, 3, true)}</h1>
        <p className="text-xs font-light">
          {image.ownership === "system" ? "System owned" : "Your image"}
        </p>
      </div>

      {/* Floating Button */}
      <button
        type="button"
        className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 p-1 rounded-full bg-background text-foreground cursor-pointer hover:scale-95 active:scale-90"
      >
        <EllipsisIcon className="w-3 h-3" />
      </button>
    </div>
  );
};

export default ImageCard;
