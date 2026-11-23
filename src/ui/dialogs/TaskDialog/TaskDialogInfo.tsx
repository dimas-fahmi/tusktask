import { IconDots } from "@tabler/icons-react";
import type { GetTaskDetailProcResult } from "@/src/lib/trpc/router/task/getTaskDetail";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../shadcn/components/ui/avatar";
import { Button } from "../../shadcn/components/ui/button";
import TaskDialogControlSection from "./TaskDialogControlSection";

const TaskDialogInfo = ({
  taskDetail,
}: {
  taskDetail: GetTaskDetailProcResult;
}) => {
  return (
    <>
      {/* Owner */}
      <TaskDialogControlSection title="Owner">
        <div className="flex items-center gap-2 p-2 border rounded-md">
          <Avatar>
            {taskDetail.user.image && (
              <AvatarImage src={taskDetail.user.image} />
            )}
            <AvatarFallback>
              {taskDetail.user.name?.[0] || "N/A"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 flex items-center justify-between">
            <div>
              <h3>{taskDetail.user.name}</h3>
              <p className="text-xs font-light opacity-70">
                {taskDetail.user.username}
              </p>
            </div>

            <Button variant={"ghost"} size={"icon-xs"} disabled>
              <IconDots />
            </Button>
          </div>
        </div>
      </TaskDialogControlSection>

      {/* Start At */}
      <TaskDialogControlSection title="Start">
        <span>Not Set</span>
      </TaskDialogControlSection>

      {/* Deadline At */}
      <TaskDialogControlSection title="Deadline">
        <span>Not Set</span>
      </TaskDialogControlSection>

      {/* Priority */}
      <TaskDialogControlSection title="Priority">
        <span>Not Set</span>
      </TaskDialogControlSection>
    </>
  );
};
export default TaskDialogInfo;
