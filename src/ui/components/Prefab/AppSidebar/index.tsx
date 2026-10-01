"use client";

import { IconLayoutSidebarLeftCollapse, IconSearch } from "@tabler/icons-react";
import Image from "next/image";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/src/ui/shadcn/components/ui/sidebar";

import UserNavCard from "../../ui/UserNavCard";
import AppSidebarNavSection from "./AppSidebarNavSection";

const AppSidebar = () => {
  const { setOpen, setOpenMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader className="space-y-1 min-h-[118px]">
        <div className="flex items-center justify-between gap-2">
          <Image
            width={32}
            height={32}
            src={"/res/logo/symbolic.png"}
            alt="TuskTask's Logo"
          />

          <Button
            variant={"outline"}
            size={"sm"}
            className={"flex-1 bg-transparent"}
          >
            <IconSearch className="w-3 h-3" />
            <span className="text-xs">Search</span>
          </Button>

          <Button
            variant={"outline"}
            className={"bg-transparent"}
            size={"icon-sm"}
            onClick={() => {
              setOpen(false);
              setOpenMobile(false);
            }}
          >
            <IconLayoutSidebarLeftCollapse />
          </Button>
        </div>

        <UserNavCard />
      </SidebarHeader>

      <SidebarContent className="px-2 pb-6">
        <AppSidebarNavSection />
      </SidebarContent>
    </Sidebar>
  );
};
export default AppSidebar;
