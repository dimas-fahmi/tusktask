import {
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/src/ui/shadcn/components/ui/context-menu";
import DeleteTaskButton from "../../actions/DeleteTaskButton";
import { useDeleteTaskButton } from "../../actions/DeleteTaskButton/store";
import { useTaskCardContext } from ".";

const TaskCardContextMenu = () => {
  const { task, queryKey } = useTaskCardContext();
  const { registerKey } = useDeleteTaskButton();

  if (queryKey) {
    registerKey(queryKey);
  }

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
      <ContextMenuItem inset variant="destructive" asChild>
        <DeleteTaskButton className="w-full" taskId={task.id}>
          Delete
        </DeleteTaskButton>
      </ContextMenuItem>
    </ContextMenuContent>
  );
};

export default TaskCardContextMenu;
