import { Info, Trash } from "lucide-react";
import { Metadata } from "next";
import React from "react";
import TrashBinIndex from "./TrashBinIndex";

export const metadata: Metadata = {
  title: "Trash Bin | Dashboard",
};

const TrashPage = () => {
  return (
    <div>
      <header className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-lg md:text-3xl font-bold text-tt-primary-foreground/80 capitalize">
            <Trash className="w-9 h-9" /> Trash Bin
          </h1>
        </div>
        <p className="flex text-sm text-muted-foreground items-center gap-2">
          <Info size={"1rem"} />
          Once you deleted a task, the task will relocated here. You can delete
          it permanently or restore it.
        </p>
      </header>
      <TrashBinIndex />
    </div>
  );
};

export default TrashPage;
