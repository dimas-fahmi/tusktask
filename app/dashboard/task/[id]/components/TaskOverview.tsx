import { Button } from "@/src/ui/components/shadcn/ui/button";
import CircularProgress from "@/src/ui/components/tusktask/prefabs/CircularProgress";
import React from "react";

const TaskOverview = () => {
  return (
    <div className="p-4 border rounded-md space-y-3">
      <header className="text-center font-semibold">
        <h1>Overview</h1>
      </header>
      <div className="flex gap-3 items-center">
        {/* Circle Indicator */}
        <div className="flex items-center">
          {/* Circle */}
          {/* <div className="h-16 w-16 border rounded-full flex items-center justify-center text-xs font-semibold">
            3 / 10
          </div> */}
          <CircularProgress current={3} total={10} className="h-16 w-16" />
        </div>

        {/* Details */}
        <div className="text-xs space-y-1 flex-grow">
          <div className="flex items-center justify-between">
            <span>Completed Tasks</span>
            <span>3</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total Tasks</span>
            <span>10</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="grid">
        <Button variant={"outline"} disabled size={"sm"}>
          Not Eligble
        </Button>
      </footer>
    </div>
  );
};

export default TaskOverview;
