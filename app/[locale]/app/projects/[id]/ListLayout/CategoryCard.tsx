"use client";

import { useSortable } from "@dnd-kit/react/sortable";
import {
  IconDots,
  IconGripVertical,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { cn } from "cn";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { TaskCategorySelectType } from "@/src/db/schema/t-taskCategory";
import { useHandleQueryError } from "@/src/hooks/useHandleQueryError";
import { useTRPC } from "@/src/lib/trpc/client/client";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/src/ui/shadcn/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/ui/shadcn/components/ui/dropdown-menu";

const SharedItems = ({
  category,
  isPending,
  setIsPending,
}: {
  category: TaskCategorySelectType;
  isPending: boolean;
  setIsPending: (pending: boolean) => void;
}) => {
  const t = useTranslations();

  const trpc = useTRPC();
  const { toast } = useHandleQueryError();

  const deleteCategory = useMutation({
    ...trpc.taskCategory.deleteTaskCategory.mutationOptions(),
    onMutate: () => {
      setIsPending(true);
    },
    onError: (err) => {
      toast("task_category_deletion_failed", err, true);
    },
    onSuccess: () => {},
    onSettled: (_d, _e, _v, _omr, ctx) => {
      ctx.client.invalidateQueries({
        queryKey: trpc.taskCategory.getTaskCategories.queryKey({
          projectId: category.projectId,
        }),
      });
      setIsPending(false);
    },
  });

  return (
    <>
      {/* Menu */}
      <ContextMenuGroup>
        <ContextMenuLabel>Menu</ContextMenuLabel>
        <ContextMenuItem disabled={isPending}>
          <IconPencil /> Edit
        </ContextMenuItem>
        <ContextMenuItem
          variant="destructive"
          disabled={isPending}
          onClick={() => {
            deleteCategory.mutate({
              projectId: category.projectId,
              taskCategoryId: category.id,
            });
          }}
        >
          <IconTrash /> {t("common.delete")}
        </ContextMenuItem>
      </ContextMenuGroup>
    </>
  );
};

const CategoryCard = ({
  category,
  index,
  dragging,
}: {
  category: TaskCategorySelectType;
  index: number;
  dragging?: string | null;
}) => {
  const t = useTranslations();
  const [expand, setExpand] = useState(true);
  const { ref } = useSortable({ id: category.id, index });

  const [isPending, setIsPending] = useState(false);

  const id = `${category.id}-category-card`;
  const isBeingDrag = dragging === category.id;

  return (
    <div
      ref={ref}
      className={cn(
        "bg-background rounded-md transition-all duration-200 border border-transparent p-4",
        isBeingDrag ? "border-border border-dashed" : "",
      )}
    >
      <ContextMenu>
        <ContextMenuTrigger
          render={(props) => (
            <div
              id={id}
              {...props}
              className={cn(
                "grid grid-cols-1 gap-2",
                isPending ? "animate-pulse" : "",
              )}
            >
              <div className="flex items-center justify-between gap-2 border-b pb-2">
                <IconGripVertical
                  stroke={1}
                  className="opacity-70 w-4 h-4 hover:cursor-grab active:cursor-grabbing"
                />
                <button
                  type="button"
                  className="flex items-center gap-2 flex-1"
                  onClick={() => {
                    setExpand(!expand);
                  }}
                  disabled={isPending}
                >
                  <span className="text-sm font-semibold">
                    {category.name === "untitled" || !category.name
                      ? t("common.untitled")
                      : category.name}
                  </span>
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={(props) => (
                      <button
                        type="button"
                        {...props}
                        disabled={isPending}
                        onClick={(e) => {
                          props?.onClick?.(e);
                        }}
                      >
                        <IconDots stroke={1} className="w-4 h-4" />
                      </button>
                    )}
                  />

                  <DropdownMenuContent>
                    <SharedItems {...{ isPending, setIsPending, category }} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <motion.div
                initial={{
                  height: "auto",
                }}
                animate={expand ? { height: "auto" } : { height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1">
                  <Button
                    disabled={isPending}
                    variant={"ghost"}
                    className={"justify-start opacity-70 hover:opacity-100"}
                  >
                    <IconPlus /> <span>New Task</span>
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        />

        <ContextMenuContent>
          <SharedItems {...{ category, isPending, setIsPending }} />
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};
export default CategoryCard;
