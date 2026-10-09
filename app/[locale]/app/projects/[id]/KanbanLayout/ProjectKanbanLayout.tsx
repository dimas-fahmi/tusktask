import { IconPlus } from "@tabler/icons-react";
import type { ProjectSelectType } from "@/src/db/schema/t-project";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const ProjectKanbanLayout = ({ data: _ }: { data?: ProjectSelectType }) => {
  return (
    <div className="flex gap-4 min-w-full max-w-full overflow-x-scroll no-scrollbar">
      {/* Non Categorized */}
      <div className="min-w-72 max-w-72 border p-4 rounded-xl space-y-4 h-full min-h-dvh">
        <header className="text-center font-semibold">
          <h1>Without Category</h1>
        </header>

        <div className="grid grid-cols-1 gap-2">
          <Button
            variant={"ghost"}
            size={"xs"}
            className={"opacity-70 not-disabled:hover:opacity-100"}
          >
            <IconPlus /> <span>New Task</span>
          </Button>
        </div>
      </div>

      {/* New Category Button */}
      <div>
        <Button
          variant={"ghost"}
          type="button"
          className={"min-h-dvh"}
          size={"xs"}
        >
          <IconPlus />
        </Button>
      </div>
    </div>
  );
};
export default ProjectKanbanLayout;
