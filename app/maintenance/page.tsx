import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Under Maintenance | TuskTask",
};

const MaintenancePage = () => {
  return (
    <div className="flex items-center justify-center h-dvh text-2xl font-bold uppercase">
      Under Major Maintenance
    </div>
  );
};

export default MaintenancePage;
