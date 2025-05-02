import { Button } from "@/src/ui/components/shadcn/ui/button";
import TaskCard from "@/src/ui/components/tusktask/cards/TaskCard";
import { Pause, Play, SkipForward, TimerReset, Wrench } from "lucide-react";
import React from "react";

const PomodoroIndex = () => {
  return (
    <div className="space-y-6">
      {/* Cycle Visualizer */}
      <section id="cycle-visualizer" className="grid grid-cols-2 gap-3">
        {/* Cycle Card */}
        <div className="relative p-4 border rounded-2xl flex items-center justify-center">
          <div>
            <h4 className="text-2xl font-bold">25:00</h4>
            <p className="text-xs text-center">Focus</p>
          </div>
          <Button variant={"outline"} className="absolute top-3 right-3 !p-1">
            <Wrench className="w-4 h-4" />
          </Button>
        </div>

        {/* Cycle Card */}
        <div className="relative p-4 border rounded-2xl flex items-center justify-center">
          <div>
            <h4 className="text-2xl font-bold">5:00</h4>
            <p className="text-xs text-center">Break</p>
          </div>
          <Button variant={"outline"} className="absolute top-3 right-3 !p-1">
            <Wrench className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Pomodoro Section */}
      <section
        id="pomodoro"
        className="border p-4 rounded-2xl grid grid-cols-1 md:grid-cols-[auto_320px] gap-4 md:gap-3"
      >
        {/* Pomodoro */}
        <div className="flex items-center justify-center">
          <div>
            <h4 className="text-6xl font-bold mb-4 text-center">25:00</h4>
            <p className="text-center text-sm">It's time to focus</p>

            {/* Controller */}
            <div className="mt-4 space-x-3">
              <Button variant={"outline"} title="Click to reset">
                <TimerReset />
              </Button>
              <Button variant={"outline"} title="Click to pause">
                <Pause />
              </Button>
              <Button variant={"outline"} title="Click to resume">
                <Play />
              </Button>
              <Button variant={"outline"} title="Click to skip cycle">
                <SkipForward />
              </Button>
            </div>
          </div>
        </div>

        {/* Task */}
        <div className="flex flex-col gap-3 ">
          `
          <TaskCard
            completedAt={null}
            id=""
            name="Naon We"
            description={null}
            key={"haha"}
            tags={["haha"]}
            createdByOptimisticUpdate={false}
          />
          `<Button>New Task</Button>
        </div>
      </section>
    </div>
  );
};

export default PomodoroIndex;
