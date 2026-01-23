import { useEffect } from "react";
import {
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
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

  useEffect(() => {
    if (queryKey) {
      registerKey(queryKey);
    }
  }, [queryKey, registerKey]);

  return (
    <ContextMenuContent className="w-52">
      <ContextMenuItem inset>
        Back
        <ContextMenuShortcut>⌘[</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem inset disabled>
        Forward
        <ContextMenuShortcut>⌘]</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem inset>
        Reload
        <ContextMenuShortcut>⌘R</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuSub>
        <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
        <ContextMenuSubContent className="w-44">
          <ContextMenuItem>Save Page...</ContextMenuItem>
          <ContextMenuItem>Create Shortcut...</ContextMenuItem>
          <ContextMenuItem>Name Window...</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Developer Tools</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" asChild>
            <DeleteTaskButton className="w-full" taskId={task.id}>
              Delete
            </DeleteTaskButton>
          </ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSeparator />
      <ContextMenuCheckboxItem checked>Show Bookmarks</ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
      <ContextMenuSeparator />
      <ContextMenuRadioGroup value="pedro">
        <ContextMenuLabel inset>People</ContextMenuLabel>
        <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
        <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
      </ContextMenuRadioGroup>
    </ContextMenuContent>
  );
};

export default TaskCardContextMenu;
