import { PlusCircle } from "lucide-react";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const SubtasksSection = () => {
  return (
    <section id="subtasks-section" className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl">Subtasks</h1>

        <Button variant={"outline"} className="flex items-center gap-2">
          <PlusCircle /> Subtask
        </Button>
      </header>
      {/* <div className="grid grid-cols-2 gap-4"></div> */}
      <span className="text-sm font-light opacity-70">No Subtasks</span>
    </section>
  );
};

export default SubtasksSection;
