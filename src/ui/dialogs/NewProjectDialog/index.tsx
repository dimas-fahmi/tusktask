"use client";

import { IconFolder, IconPencil } from "@tabler/icons-react";
import { cn } from "cn";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  VIEW_LAYOUTS_ENTRIES,
  type ViewLayout,
} from "@/src/app/data/viewLayout";
import { useNewProject } from "@/src/hooks/useNewProject";
import MainInput from "../../components/ui/MainInput";
import { Button } from "../../shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../../shadcn/components/ui/drawer";
import { useIsMobile } from "../../shadcn/hooks/use-mobile";

const Body = () => {
  const [layout, setLayout] = useState<ViewLayout>("list");
  const t = useTranslations();
  const [setOpen] = useNewProject(useShallow((s) => [s.setOpen]));

  return (
    <form className="space-y-6">
      <div className="space-y-6">
        <MainInput label="Name" />
        <MainInput
          label="Description"
          textArea
          className="max-h-24 no-scrollbar"
        />

        <div className="flex items-center gap-3">
          {/* Preview */}
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <IconFolder className="w-5 h-5" stroke={1} />
          </div>

          <div className="flex-1 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Project Icon</h2>
              <p className="text-xs opacity-70">
                Customize your project's icon
              </p>
            </div>

            <Button variant={"ghost"} size={"icon-sm"}>
              <IconPencil />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <h2>Project Layout</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {VIEW_LAYOUTS_ENTRIES.map(([key, { icon: Icon }]) => (
              <button
                type="button"
                key={key}
                className={cn(
                  "flex flex-col items-center justify-center p-2 border rounded-md transition-all duration-300 text-xs",
                  layout === key
                    ? "bg-primary text-primary-foreground"
                    : "not-disabled:hover:bg-foreground/10",
                )}
                onClick={() => {
                  setLayout(key);
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{t(`common.view_layouts.${key}`)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <footer className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={"outline"}
          onClick={() => {
            setOpen(false);
          }}
        >
          Close
        </Button>
        <Button type="submit" disabled>
          Save
        </Button>
      </footer>
    </form>
  );
};

const NewProjectDialog = () => {
  const isMobile = useIsMobile();

  const [open, setOpen] = useNewProject(useShallow((s) => [s.open, s.setOpen]));

  const title = "New Project";
  const desc = "Creating new project";

  const onOpenChange = (open: boolean) => {
    // RESET FORM
    setOpen(open);
  };

  return isMobile ? (
    <Drawer {...{ open, onOpenChange }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{desc}</DrawerDescription>
        </DrawerHeader>

        <Body />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>

        <Body />
      </DialogContent>
    </Dialog>
  );
};
export default NewProjectDialog;
