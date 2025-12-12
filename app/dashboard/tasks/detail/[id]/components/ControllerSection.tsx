import { Circle, Menu } from "lucide-react";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const ControllerSection = () => {
  return (
    <section id="controller-section" className="flex justify-between">
      <div>
        <Button variant={"outline"} size={"sm"} className="text-xs">
          <Circle /> <span>Mark complete</span>
        </Button>
      </div>

      <div>
        <Button variant={"outline"} size={"sm"} className="text-xs">
          <Menu />
        </Button>
      </div>
    </section>
  );
};

export default ControllerSection;
