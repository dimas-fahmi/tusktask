import { Button } from "@/src/ui/components/shadcn/ui/button";
import { Pause, Play, SkipForward, TimerReset } from "lucide-react";

// Component for timer control buttons
const TimerControls = ({
  isRunning,
  setIsRunning,
  resetTimer,
  skipCycle,
  stopAllSounds,
}: {
  isRunning: boolean;
  setIsRunning: (value: boolean) => void;
  resetTimer: () => void;
  skipCycle: () => void;
  stopAllSounds: () => void;
}) => {
  return (
    <div className="mt-4 space-x-3">
      <Button variant={"outline"} onClick={resetTimer} title="Click to reset">
        <TimerReset />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => setIsRunning(false)}
        disabled={!isRunning}
        title="Click to pause"
      >
        <Pause />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => {
          setIsRunning(true);
          stopAllSounds();
        }}
        disabled={isRunning}
        title="Click to resume"
      >
        <Play />
      </Button>
      <Button
        variant={"outline"}
        onClick={skipCycle}
        title="Click to skip cycle"
      >
        <SkipForward />
      </Button>
    </div>
  );
};

export default TimerControls;
