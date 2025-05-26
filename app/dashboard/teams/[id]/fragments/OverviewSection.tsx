import React from "react";
import CircularProgress from "@/src/ui/components/tusktask/prefabs/CircularProgress";
import { Clipboard, ShoppingCart, Users } from "lucide-react";

const OverviewSection = () => {
  return (
    <section
      id="overview"
      className="w-full border p-4 text-sm rounded-md space-y-3"
    >
      {/* Overview Item */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span>
            <Clipboard className="w-4 h-4" />
          </span>
          <span>Tasks</span>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <CircularProgress current={6} total={9} size={13} />
          6/9
        </div>
      </div>

      {/* Overview Item */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span>
            <ShoppingCart className="w-4 h-4" />
          </span>
          <span>Shopping Lists</span>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <CircularProgress current={2} total={4} size={13} />
          2/4
        </div>
      </div>

      {/* Overview Item */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span>
            <Users className="w-4 h-4" />
          </span>
          <span>Members</span>
        </div>
        <div className="text-xs text-muted-foreground">1</div>
      </div>
    </section>
  );
};

export default OverviewSection;
