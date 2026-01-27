import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { PROJECT_MEMBERSHIP_ROLE_PERMISSIONS } from "@/src/lib/app/projectRBAC";
import { authClient } from "@/src/lib/auth/client";
import { queryIndex } from "@/src/lib/queries";
import {
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/src/ui/shadcn/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";
import DeleteTaskButton from "../../actions/DeleteTaskButton";
import { useDeleteTaskButton } from "../../actions/DeleteTaskButton/store";
import { useTaskCardContext } from ".";

const TaskCardContextMenu = () => {
  const { task, queryKey } = useTaskCardContext();
  const { registerKey } = useDeleteTaskButton();

  const { data: session } = authClient.useSession();
  const membershipsQuery = queryIndex.project.memberships({
    projectId: task.projectId,
    userId: session?.user?.id,
    orderBy: "type",
    orderDirection: "asc",
  });
  const { data: membershipsQueryResponse } = useQuery({
    ...membershipsQuery.queryOptions,
  });
  const memberships = membershipsQueryResponse?.result?.result;
  const myMembership = memberships?.find((m) => m.userId === session?.user?.id);
  const myPermissions = myMembership
    ? PROJECT_MEMBERSHIP_ROLE_PERMISSIONS[myMembership?.type]
    : undefined;

  useEffect(() => {
    if (queryKey) {
      registerKey(queryKey);
    }
  }, [queryKey, registerKey]);

  return (
    <ContextMenuContent className="w-52">
      <ContextMenuItem inset>Open</ContextMenuItem>

      <ContextMenuSeparator />
      <ContextMenuCheckboxItem>Done</ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem>Pinned</ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem>Archived</ContextMenuCheckboxItem>

      <ContextMenuSeparator />
      <ContextMenuSub>
        <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <ContextMenuItem>Open Project</ContextMenuItem>
          <ContextMenuItem>Assign to a member</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Edit</ContextMenuItem>
          <ContextMenuItem variant="destructive">Reschedule</ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>

      <ContextMenuSeparator />
      <Tooltip>
        <TooltipTrigger asChild>
          <ContextMenuItem inset variant="destructive" asChild>
            <DeleteTaskButton
              className="w-full"
              taskId={task.id}
              disabled={!myPermissions?.deleteTask}
            >
              Delete
            </DeleteTaskButton>
          </ContextMenuItem>
        </TooltipTrigger>
        <TooltipContent>
          {!myPermissions?.deleteTask
            ? "You doesn't have permission to delete this task"
            : "Delete this task"}
        </TooltipContent>
      </Tooltip>
    </ContextMenuContent>
  );
};

export default TaskCardContextMenu;
