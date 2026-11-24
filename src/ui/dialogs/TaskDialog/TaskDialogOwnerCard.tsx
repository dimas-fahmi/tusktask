"use client";

import { IconDots } from "@tabler/icons-react";
import type { GetTaskDetailProcResult } from "@/src/lib/trpc/router/task/getTaskDetail";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../shadcn/components/ui/avatar";
import { Button } from "../../shadcn/components/ui/button";
import TaskDialogControlSection from "./TaskDialogControlSection";

const TaskDialogOwnerCard = ({
  taskDetail,
}: {
  taskDetail: GetTaskDetailProcResult;
}) => {
  return (
    <TaskDialogControlSection title="Owner">
      <div className="flex items-center gap-2 p-2 border border-transparent hover:border-border transition-all duration-300 rounded-md">
        <Avatar>
          {taskDetail.user.image && <AvatarImage src={taskDetail.user.image} />}
          <AvatarFallback>{taskDetail.user.name?.[0] || "N/A"}</AvatarFallback>
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
  );
};

export default TaskDialogOwnerCard;
