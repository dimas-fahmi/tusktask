import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { IconPlus } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { ProjectSelectType } from "@/src/db/schema/t-project";
import { useHandleQueryError } from "@/src/hooks/useHandleQueryError";
import { useTRPC } from "@/src/lib/trpc/client/client";
import CategoryCard from "@/src/ui/components/ui/CategoryCard";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const ProjectListLayout = ({
  data: projectData,
}: {
  data?: ProjectSelectType;
}) => {
  const [isDragging, setIsDragging] = useState<string | null>(null);

  const trpc = useTRPC();
  const { toast } = useHandleQueryError();

  const { data: _categories } = useQuery({
    ...trpc.taskCategory.getTaskCategories.queryOptions({
      projectId: projectData?.id ?? "",
    }),
    enabled: !!projectData?.id,
  });

  const categories = _categories ?? [];

  const createCategory = useMutation({
    ...trpc.taskCategory.createTaskCategory.mutationOptions(),
    onError: (err) => {
      toast("error-creating-task-category", err, true);
    },
    onSuccess: (_d, _v, _omr, ctx) => {
      if (projectData) {
        ctx.client.invalidateQueries({
          queryKey: trpc.taskCategory.getTaskCategories.queryKey({
            projectId: projectData?.id,
          }),
        });
      }
    },
  });

  return (
    <div className="grid grid-cols-1 gap-2">
      {/* Non-categorized tasks */}
      <div className="grid grid-cols-1 gap-2">
        {/* New Button */}
        <Button
          variant={"ghost"}
          className={"justify-start opacity-70 hover:opacity-100"}
        >
          <IconPlus /> <span>New Task</span>
        </Button>
      </div>

      {/* Categories Container */}
      {!!categories.length && (
        <div className="space-y-2 md:px-4">
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
        </div>
      )}

      {/* Categorized Task */}
      <div className="grid grid-cols-1 gap-2">
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
      </div>
    </div>
  );
};
export default ProjectListLayout;
