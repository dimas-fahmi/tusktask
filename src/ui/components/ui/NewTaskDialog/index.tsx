"use client";

import { Expand, Minimize, Minimize2, Save } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useGetSelfProjects } from "@/src/lib/queries/hooks/useGetSelfProjects";
import { useNewTaskDialogStore } from "@/src/lib/stores/newTaskDialog";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Checkbox } from "@/src/ui/shadcn/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";
import { Label } from "@/src/ui/shadcn/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/src/ui/shadcn/components/ui/select";
import { DatePicker } from "../DatePicker/v1";
import Input from "../Input/input";
import PrioritySlider from "../PrioritySlider";

const NewTaskDialog = () => {
  // Advance mode state
  const [advanceMode, setAdvanceMode] = useState(false);

  // Pull values from newTaskDialog store
  const { open, onOpenChange } = useNewTaskDialogStore();

  // Pull projects
  const { data: projectsQuery, isPending: isLoadingProjects } =
    useGetSelfProjects();
  const projects = projectsQuery?.result?.result || [];

  const [rangeVal, setRangeVal] = useState<number[]>([0]);

  return (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent className="p-0 px-4 pb-6 pt-4">
        <DialogHeader className="sr-only">
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>Create New Task</DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form className="space-y-6">
          {/* Fields */}
          <div>
            {/* Fields [advanceMode=false] */}
            <motion.div
              initial={{ height: "auto" }}
              animate={advanceMode ? { height: 0 } : { height: "auto" }}
              transition={{
                duration: 0.3,
              }}
              className="overflow-hidden p-0"
            >
              <div>
                {/* New Task Name */}
                <Input
                  inputProps={{
                    className:
                      "border-none outline-none p-0 text-4xl font-header font-bold rounded-none h-18",
                    placeholder: "Name",
                  }}
                />

                {/* New Task Description */}
                <textarea
                  className="border-0 outline-0 resize-none field-sizing-content text-sm font-light opacity-80 p-0 max-h-48 w-full custom-scrollbar min-h-16"
                  placeholder="Description (optional)"
                />
              </div>
            </motion.div>

            {/* Fields [advanceMode=true] */}
            <motion.div
              initial={{ height: 0 }}
              animate={!advanceMode ? { height: 0 } : { height: "auto" }}
              transition={{
                duration: 0.3,
              }}
              className="overflow-hidden p-0"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {/* Start At */}
                  <div className="space-y-1">
                    <Label>Start At</Label>
                    <DatePicker classes={{ triggerClass: "w-full" }} />
                  </div>

                  {/* Finish At */}
                  <div className="space-y-1">
                    <Label>Finish At</Label>
                    <DatePicker classes={{ triggerClass: "w-full" }} />
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-4 mb-6">
                  <Label>Priority</Label>
                  <PrioritySlider
                    value={rangeVal}
                    onValueChange={(e) => {
                      setRangeVal(e);
                    }}
                  />
                </div>

                {/* Settings */}
                <div className="space-y-2">
                  {/* Pin */}
                  <div className="flex items-start gap-2 opacity-70 rounded-lg">
                    <Checkbox id="pin-task" className="mt-0.5" defaultChecked />
                    <div className="grid gap-2 text-sm">
                      <label htmlFor="pin-task">Pin This New Task</label>
                    </div>
                  </div>

                  {/* Claim */}
                  <div className="flex items-start gap-2 opacity-70 rounded-lg">
                    <Checkbox
                      id="claim-task"
                      className="mt-0.5"
                      defaultChecked
                    />
                    <div className="grid gap-2 text-sm">
                      <label htmlFor="claim-task">Claim This New Task</label>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <footer className="border-t pt-4 flex items-center justify-between">
            {/* Project */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={"outline"}
                size={"sm"}
                className="rounded-full w-9 h-9"
                aria-label="Expand/Minimize advance settings"
                onClick={() => {
                  setAdvanceMode(!advanceMode);
                }}
              >
                {advanceMode ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Expand className="w-5 h-5" />
                )}
              </Button>
              <Select>
                <SelectTrigger className="text-xs" disabled={isLoadingProjects}>
                  Select Project
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project?.id} value={project?.id}>
                      {project?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size={"sm"}
                aria-label="Save Task"
                className="rounded-full w-9 h-9"
              >
                <Save className="w-5 h-5" />
              </Button>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant={"outline"}
                  size={"sm"}
                  aria-label="Cancel and minimize dialog"
                  className="rounded-full w-9 h-9"
                >
                  <Minimize2 className="w-5 h-5" />
                </Button>
              </DialogClose>
            </div>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
