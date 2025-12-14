import { Funnel, Search } from "lucide-react";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const Controller = () => {
  return (
    <div className="flex items-center justify-between">
      {/* Buttons */}
      <div className="flex items-center gap-2">
        <Button size={"sm"} variant={"outline"} aria-label="Filter tasks">
          <Funnel className="w-4 h-4" />
        </Button>
        <Button size={"sm"} variant={"outline"} aria-label="Search tasks">
          <Search className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Controller;
