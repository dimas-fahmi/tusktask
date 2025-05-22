import {
  Circle,
  CircleCheckBig,
  CornerDownRight,
  Ellipsis,
} from "lucide-react";
import React from "react";

const TaskCard = () => {
  return (
    <div className="border rounded-md cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl active:scale-95">
      <header className="px-4 pt-4 flex items-center gap-2">
        <div>
          <Circle className="w-5 h-5" />
        </div>
        <div>Beli Jagung</div>
      </header>
      <div className="text-xs mt-2 px-4 pb-4 text-muted-foreground">
        No description
      </div>
      <footer className="flex items-center space-x-2 text-xs text-muted-foreground">
        <div className="felx items-center justify-center ps-4 px-2 py-2 ">
          <div className="flex items-center gap-1">
            <span>
              <CornerDownRight className="w-3 h-3" />
            </span>
            <span>4</span>
          </div>
        </div>
        <div className="felx items-center justify-center px-1 py-2 ">
          {" "}
          <div className="flex items-center gap-1">
            <span>
              <Circle className="w-3 h-3" />
            </span>
            <span>4</span>
          </div>
        </div>
        <div className="block px-1 py-2">
          <div className="flex items-center gap-1">
            <span>
              <CircleCheckBig className="w-3 h-3" />
            </span>
            <span>4</span>
          </div>
        </div>
        <div className="flex justify-end px-1 py-2 flex-grow pe-4 opacity-50 hover:opacity-100 cursor-pointer transition-all duration-300">
          <div className="flex items-center gap-1">
            <span>
              <Ellipsis className="w-5 h-5" />
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TaskCard;
