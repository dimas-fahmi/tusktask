"use client";

import { CirclePlus, PanelLeftClose, Settings } from "lucide-react";
import Link from "next/link";
import { useNewTaskDialogStore } from "@/src/lib/stores/newTaskDialog";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { useSidebar } from "@/src/ui/shadcn/components/ui/sidebar";

const Controller = () => {
  const { setOpen, setOpenMobile, isMobile } = useSidebar();
  const { onOpenChange: setNTDOpen } = useNewTaskDialogStore();

  return (
    <div className="grid grid-cols-1 gap-3">
      <Button
        onClick={() => {
          setNTDOpen(true);
        }}
      >
        <CirclePlus /> New Task
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <Button variant={"outline"} asChild>
          <Link
            href={"/dashboard/settings"}
            onClick={() => {
              if (isMobile) {
                setOpenMobile(false);
              }
            }}
          >
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
