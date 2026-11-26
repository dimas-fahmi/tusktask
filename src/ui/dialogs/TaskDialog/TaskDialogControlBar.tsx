import { IconDots, IconPencil, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useTaskActions } from "@/src/hooks/useTaskActions";
import IconRenderer from "../../components/IconRenderer";
import { Button } from "../../shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../shadcn/components/ui/dropdown-menu";
import { useIsMobile } from "../../shadcn/hooks/use-mobile";
import { useTaskDialogCtx } from ".";

const TaskDialogControlBar = () => {
  const t = useTranslations();
  const isMobile = useIsMobile();

  const { taskDetail, setOpen } = useTaskDialogCtx();

  const { delete: deleteTask } = useTaskActions({ task: taskDetail });

  return (
    <div className="px-4 py-2 md:bg-primary md:text-primary-foreground text-xs flex items-center justify-between gap-4">
      <div className="flex items-center gap-1">
        <IconRenderer
          iconName={taskDetail?.project?.iconId}
          className="w-4 h-4"
        />
        <span>{taskDetail?.project?.name}</span>
      </div>

      <div className="flex gap-1 items-center">
        <Button
          variant={"ghost"}
          size={isMobile ? "icon" : "icon-xs"}
          className={"hidden md:flex"}
        >
          <IconPencil />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={(trigger) => (
              <Button
                variant={"ghost"}
                size={isMobile ? "icon" : "icon-xs"}
                {...trigger}
              >
                <IconDots />
              </Button>
            )}
          />

          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t("common.task_menu")}</DropdownMenuLabel>

              {/* TODO: Register new icons for: Edit and Close */}
              <DropdownMenuItem>
                <IconRenderer iconName={"help"} />
                {t("common.edit")}
              </DropdownMenuItem>

              <DropdownMenuItem>
                <IconRenderer iconName={"airplane"} />
                {t("common.close")}
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  deleteTask().mutate(
                    {
                      taskId: taskDetail.id,
                    },
                    {
                      onSuccess: () => {
                        setOpen(false);
                      },
                    },
                  );
                }}
              >
                <IconRenderer iconName={"trash"} />
                {t("common.delete")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant={"ghost"}
          size={"icon-xs"}
          onClick={() => {
            setOpen(false);
          }}
        >
          <IconX />
        </Button>
      </div>
    </div>
  );
};
export default TaskDialogControlBar;
