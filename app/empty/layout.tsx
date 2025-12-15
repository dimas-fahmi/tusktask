"use client";
import { redirect } from "next/navigation";
import type React from "react";
import { authClient } from "@/src/lib/auth/client";

const EmptyLayout = ({ children }: { children: Readonly<React.ReactNode> }) => {
  const { data: session, isPending: isLoadingSession } =
    authClient.useSession();

  if (!session && !isLoadingSession) {
    redirect("/auth");
  }

  return <div>{children}</div>;
};

export default EmptyLayout;
