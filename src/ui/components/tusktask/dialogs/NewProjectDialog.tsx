import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/ui/dialog";
import { Button } from "../../shadcn/ui/button";

export interface NewProjectDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewProjectDialog = ({ open, setOpen }: NewProjectDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="sr-only">
          <DialogTitle>Create A New Project</DialogTitle>
          <DialogDescription>A Dialog to create a new task</DialogDescription>
        </DialogHeader>
        <form>
          {/* Projects Title And Description */}
          <div>
            <div className="space-y-4 mb-7 overflow-visible">
              <div className="flex flex-col overflow-visible">
                <input
                  type="text"
                  className="border-0 text-3xl flex items-center outline-0 ring-0 focus:ring-0 focus:border-0 w-full overflow-visible"
                  placeholder="Projects Name"
                />
              </div>

              <div className="flex flex-col">
                <textarea
                  rows={3}
                  className="border-0 text-sm block outline-0 ring-0 focus:ring-0 focus:border-0 w-full resize-none field-sizing-content min-h-11 max-h-60"
                  placeholder="Description (optional)"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              variant={"outline"}
            >
              Cancel
            </Button>
            <Button>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
