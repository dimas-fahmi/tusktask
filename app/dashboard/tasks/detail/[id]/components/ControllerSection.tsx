import { Circle, Menu } from "lucide-react";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const ControllerSection = () => {
  return (
    <section id="controller-section" className="flex justify-between">
      <div>
        <Button variant={"outline"} size={"sm"} className="text-xs">
          <Circle className="w-4 h-4" /> <span>Mark complete</span>
        </Button>
      </div>

      <div>
        <Button
          variant={"outline"}
          size={"sm"}
          className="text-xs"
          aria-label="Task actions"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>
    </section>
  );
};

export default ControllerSection;
