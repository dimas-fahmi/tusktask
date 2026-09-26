import { cn } from "cn";
import type React from "react";
import { Skeleton } from "@/src/ui/shadcn/components/ui/skeleton";

const AuthContentSkeleton = (props: React.ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      id="auth-content-skeleton"
      {...props}
      className={cn("space-y-4", props?.className)}
    >
      <header className="space-y-1.5">
        <Skeleton className="h-7 w-60" />
        <Skeleton className="h-3 w-78" />
      </header>

      <div className="space-y-2">
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>

      <footer className="flex items-center justify-end gap-1">
        <Skeleton className="w-24 h-8 rounded-xl" />
        <Skeleton className="w-28 h-8 rounded-xl" />
      </footer>
    </div>
  );
};
export default AuthContentSkeleton;
