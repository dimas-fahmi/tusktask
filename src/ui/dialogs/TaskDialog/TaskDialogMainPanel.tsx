import { IconCircle, IconPlus } from "@tabler/icons-react";
import type { GetTaskDetailProcResult } from "@/src/lib/trpc/router/task/getTaskDetail";
import { Button } from "../../shadcn/components/ui/button";

const TaskDialogMainPanel = ({
  taskDetail,
  setOpen,
}: {
  taskDetail: GetTaskDetailProcResult;
  setOpen?: (open: boolean) => void;
}) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Top Side */}
      <div className="space-y-2">
        {/* Task Name */}
        <div className="flex items-center gap-4">
          <button type="button">
            <IconCircle />
          </button>

          <h1 className="text-xl font-bold">{taskDetail?.name}</h1>
        </div>

        {/* Task Description */}
        <div className="min-h-[120px] opacity-70">
          {taskDetail?.description || "No description"}
        </div>
      </div>

      {/* Subtasks */}
      <div className="grid grid-cols-1">
        <Button
          variant={"ghost"}
          size={"sm"}
          className={"justify-start opacity-70 not-disabled:hover:opacity-100"}
        >
          <IconPlus /> <span>New Subtask</span>
        </Button>
      </div>

      <Button
        variant={"outline"}
        className={"flex md:hidden"}
        onClick={() => {
          setOpen?.(false);
        }}
      >
        Close
      </Button>
    </div>
  );
};
export default TaskDialogMainPanel;
