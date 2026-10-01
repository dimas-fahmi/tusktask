"use client";

import {
  IconHelpCircle,
  IconLayoutSidebarLeftCollapse,
  IconSearch,
} from "@tabler/icons-react";
import Image from "next/image";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Progress } from "@/src/ui/shadcn/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/src/ui/shadcn/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";
import UserNavCard from "../../ui/UserNavCard";
import AppSidebarNavSection from "./AppSidebarNavSection";

const AppSidebar = () => {
  const { setOpen, setOpenMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader className="space-y-1">
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

        {/* Controller */}
        {/* User's level */}
        <div className="space-y-1 p-2 border rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extralight">Newbie</span>

            <Tooltip>
              <TooltipTrigger
                render={(props) => (
                  <span {...props}>
                    <IconHelpCircle className="w-4 h-4" />
                  </span>
                )}
              />

              <TooltipContent className={"max-w-xs"}>
                <div>
                  <p>
                    You'll earn 100 points everytime you finished a task
                    everyday. Click to view your point history.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <Progress value={15} className={"h-1.5"} />
          <div className="flex items-center justify-between">
            <span className="text-xs font-extralight">100</span>
            <span className="text-xs font-extralight">1000</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pb-6">
        <AppSidebarNavSection />
      </SidebarContent>
    </Sidebar>
  );
};
export default AppSidebar;
