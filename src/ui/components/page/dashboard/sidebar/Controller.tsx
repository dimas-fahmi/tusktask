"use client";

import { CirclePlus, PanelLeftClose, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { useSidebar } from "@/src/ui/shadcn/components/ui/sidebar";

const Controller = () => {
  const { setOpen, setOpenMobile } = useSidebar();

  return (
    <div className="grid grid-cols-1 gap-3">
      <Button>
        <CirclePlus /> New Task
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <Button variant={"outline"} asChild>
          <Link href={"/dashboard/settings"}>
            <Settings /> Settings
          </Link>
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            setOpen(false);
            setOpenMobile(false);
          }}
        >
          <PanelLeftClose /> Close
        </Button>
      </div>
    </div>
  );
};

export default Controller;
