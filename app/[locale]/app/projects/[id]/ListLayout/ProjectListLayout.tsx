import { IconPlus } from "@tabler/icons-react";
import type { ProjectSelectType } from "@/src/db/schema/t-project";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const ProjectListLayout = ({ data: _ }: { data?: ProjectSelectType }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
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

      {/* Categorized Task */}
      <div className="grid grid-cols-1 gap-2">
        {/* New Button */}
        <Button
          variant={"ghost"}
          className={"justify-start opacity-70 hover:opacity-100"}
        >
          <IconPlus /> <span>New Category</span>
        </Button>
      </div>
    </div>
  );
};
export default ProjectListLayout;
