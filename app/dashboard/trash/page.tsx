import { Metadata } from "next";
import React from "react";
import TrashBinIndex from "./TrashBinIndex";

export const metadata: Metadata = {
  title: "Trash Bin | Dashboard",
};

const TrashPage = () => {
  return (
    <div>
      <TrashBinIndex />
    </div>
  );
};

export default TrashPage;
