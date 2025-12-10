import Link from "next/link";
import { cn } from "@/src/ui/shadcn/lib/utils";

export const SettingIndexItem = ({
  href,
  title,
  isActive,
  className,
}: {
  href: string;
  title: string;
  isActive?: boolean;
  className?: string;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        `${isActive ? "opacity-100 text-primary font-semibold" : "opacity-55"} transition-all duration-300 hover:scale-95 active:90 text-sm`,
        className,
      )}
      onClick={(e) => {
        e.preventDefault();
        const el = document.querySelector(href) as HTMLElement;
        if (!el) return;

        window.scrollTo({
          top: el.offsetTop - 20,
          behavior: "smooth",
        });
      }}
    >
      {title}
    </Link>
  );
};
