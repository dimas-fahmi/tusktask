"use client";

import { useSortable } from "@dnd-kit/react/sortable";
import {
  IconDeviceFloppy,
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
  editMode,
  setEditMode,
  handleSave,
}: {
  category: TaskCategorySelectType;
  isPending: boolean;
  setIsPending: (pending: boolean) => void;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  handleSave: () => void;
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
        {editMode && (
          <ContextMenuItem
            onClick={() => {
              handleSave();
            }}
          >
            <IconDeviceFloppy />
            <span>{t("common.save")}</span>
          </ContextMenuItem>
        )}
        <ContextMenuItem
          disabled={isPending || editMode}
          onClick={() => {
            setEditMode(true);
          }}
        >
          <IconPencil /> Edit
        </ContextMenuItem>
        <ContextMenuItem
          variant="destructive"
          disabled={isPending || editMode}
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
  const [editMode, setEditMode] = useState(false);

  const [categoryName, setCategoryName] = useState(
    category?.name === "untitled" || !category?.name
      ? t("common.untitled")
      : category.name,
  );

  const { ref } = useSortable({ id: category.id, index });

  const [isPending, setIsPending] = useState(false);

  const id = `${category.id}-category-card`;
  const isBeingDrag = dragging === category.id;

  const trpc = useTRPC();
  const { toast } = useHandleQueryError();

  const updateTaskCategory = useMutation({
    ...trpc.taskCategory.updateTaskCategory.mutationOptions(),
    onMutate: () => {
      setIsPending(true);
    },
    onError: (err) => {
      toast("update-task-category-mutation-failed", err, true);
    },
    onSuccess: () => {},
    onSettled: (_d, _err, _var, _omr, ctx) => {
      setIsPending(false);
      ctx.client.invalidateQueries({
        queryKey: trpc.taskCategory.getTaskCategories.queryKey({
          projectId: category.projectId,
        }),
      });
    },
  });

  const handleSave = () => {
    setEditMode(false);

    if (categoryName !== category.name) {
      updateTaskCategory.mutate({
        projectId: category.projectId,
        taskCategoryId: category.id,
        data: {
          name: categoryName,
        },
      });
    }
  };

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
              onDoubleClick={() => {
                setEditMode(!editMode);
              }}
            >
              <div className="flex items-center justify-between gap-2 border-b pb-2">
                <IconGripVertical
                  stroke={1}
                  className="opacity-70 w-4 h-4 hover:cursor-grab active:cursor-grabbing"
                />
                {editMode ? (
                  <form
                    className="flex-1"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSave();
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Category Name"
                      className="outline-0 text-sm w-full"
                      value={categoryName}
                      onChange={(e) => {
                        setCategoryName(e.target.value);
                      }}
                      autoComplete="off"
                    />
                  </form>
                ) : (
                  <button
                    type="button"
                    className="flex items-center gap-2 flex-1"
                    onClick={() => {
                      setExpand(!expand);
                    }}
                    disabled={isPending}
                  >
                    <span className="text-sm font-semibold">
                      {categoryName === "untitled" || !categoryName
                        ? t("common.untitled")
                        : categoryName}
                    </span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={editMode ? { width: "auto" } : { width: 0 }}
                    className="overflow-hidden"
                  >
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => {
                        handleSave();
                      }}
                    >
                      <IconDeviceFloppy className="w-4 h-4" stroke={1} />
                    </button>
                  </motion.div>

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
                      <SharedItems
                        {...{
                          isPending,
                          setIsPending,
                          category,
                          editMode,
                          setEditMode,
                          handleSave,
                        }}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
          <SharedItems
            {...{
              category,
              isPending,
              setIsPending,
              editMode,
              setEditMode,
              handleSave,
            }}
          />
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};
export default CategoryCard;
