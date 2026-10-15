import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";
import type { CompleteProjectType } from "@/src/db/schema/t-project";
import { useHandleQueryError } from "@/src/hooks/useHandleQueryError";
import { useNewTask } from "@/src/hooks/useNewTask";
import { useTRPC } from "@/src/lib/trpc/client/client";
import CategoryCard from "@/src/ui/components/ui/CategoryCard";
import TaskCard from "@/src/ui/components/ui/TaskCard";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const ProjectListLayout = ({
  data: projectData,
}: {
  data: CompleteProjectType;
}) => {
  const [isDragging, setIsDragging] = useState<string | null>(null);

  const trpc = useTRPC();
  const { toast } = useHandleQueryError();

  const categories = projectData?.taskCategories ?? [];

  const createCategory = useMutation({
    ...trpc.taskCategory.createTaskCategory.mutationOptions(),
    onError: (err) => {
      toast("error-creating-task-category", err, true);
    },
    onSuccess: (_d, _v, _omr, ctx) => {
      if (projectData) {
        ctx.client.invalidateQueries({
          queryKey: trpc.project.getProjectDetail.queryKey({
            id: projectData.id,
          }),
        });
      }
    },
  });

  const uncategorizedTasks = projectData?.uncategorizedTasks ?? [];

  const newTaskDialog = useNewTask((s) => s.open);

  return (
    <div className="grid grid-cols-1 gap-2">
      {/* Non-categorized tasks */}
      <motion.div className="grid grid-cols-1 gap-2" layout>
        <div>
          {uncategorizedTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {/* New Button */}
        <Button
          variant={"ghost"}
          className={"justify-start opacity-70 hover:opacity-100"}
          onClick={() => {
            newTaskDialog({
              projectId: projectData.id,
              taskCategoryId: null,
            });
          }}
        >
          <IconPlus /> <span>New Task</span>
        </Button>
      </motion.div>

      {/* Categories Container */}
      {!!categories.length && (
        <motion.div className="space-y-2 md:px-4" layout>
          <DragDropProvider
            onDragStart={(e) => {
              if (isSortable(e.operation.source)) {
                setIsDragging(e.operation.source.id as string);
              }
            }}
            onDragEnd={() => {
              setIsDragging(null);
            }}
          >
            {categories
              .sort((a, b) => {
                if (!a.projectOrderKey) return 1;
                if (!b.projectOrderKey) return -1;

                return a.projectOrderKey.localeCompare(b.projectOrderKey);
              })
              .map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                  dragging={isDragging}
                />
              ))}
          </DragDropProvider>
        </motion.div>
      )}

      {/* Categorized Task */}
      <motion.div className="grid grid-cols-1 gap-2" layout>
        {/* New Button */}
        <Button
          disabled={createCategory.isPending || !projectData?.id}
          variant={"ghost"}
          className={"justify-start opacity-70 hover:opacity-100"}
          onClick={() => {
            if (!projectData?.id) return;

            createCategory.mutate({
              projectId: projectData.id,
            });
          }}
        >
          <IconPlus /> <span>New Category</span>
        </Button>
      </motion.div>
    </div>
  );
};
export default ProjectListLayout;
