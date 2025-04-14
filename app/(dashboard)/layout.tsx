"use client";

import React from "react";
import useThemeContext from "@/src/lib/tusktask/hooks/context/useThemeContext";
import Link from "next/link";

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { setCurrentTheme } = useThemeContext();

  return (
    <div id={"dashboardLayout"}>
      {children}
      <button onClick={() => setCurrentTheme("default")}>default</button>
      <button onClick={() => setCurrentTheme("cassandra-pink")}>
        casandra
      </button>
      <Link href={"/"}>Homepage</Link>
    </div>
  );
};

export default DashboardLayout;
