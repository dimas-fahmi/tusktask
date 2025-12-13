import { Funnel, Search } from "lucide-react";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const Controller = () => {
  return (
    <div className="flex items-center justify-between">
      {/* Buttons */}
      <div className="flex items-center gap-2">
        <Button size={"sm"} variant={"outline"}>
          <Funnel />
        </Button>
        <Button size={"sm"} variant={"outline"}>
          <Search />
        </Button>
      </div>
    </div>
  );
};

export default Controller;
