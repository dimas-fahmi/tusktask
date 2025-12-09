import { zodResolver } from "@hookform/resolvers/zod";
import { Minimize, Pause, Play, SaveIcon, TimerReset } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import z from "zod";
import { useNotificationStore } from "@/src/lib/stores/notification";
import { usePomodoroStore } from "@/src/lib/stores/pomodoro";
import {
  formatDurationLuxon,
  formatMinuteToMillis,
} from "@/src/lib/utils/formatTime";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";
import { Separator } from "@/src/ui/shadcn/components/ui/separator";
import CircularProgressBar from "../CircularProgressBar";

// The schema is now designed to handle a string input that must be converted to a number.
const durationSchema = z.object({
  focus: z.coerce
    .number()
    .min(1, { message: "Must be at least 1 minute." })
    .max(60, { message: "Can't exceed 60 minutes." }),
  rest: z.coerce
    .number()
    .min(1, { message: "Must be at least 1 minute." })
    .max(60, { message: "Can't exceed 60 minutes." }),
});

const PomodoroDialog = () => {
  const {
    dialogOpen: open,
    setDialogOpen: onOpenChange,
    currentPhase,
    focusTime,
    isRunning,
    restTime,
    setFocusTime,
    setIsRunning,
    setRestTime,
    elapsedTime,
    isStarted,
    reset: resetTimer,
  } = usePomodoroStore();

  const isDesktop = useMediaQuery({
    query: "(min-width:768px)",
  });

  // Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(durationSchema),
    mode: "onChange",
    defaultValues: {
      focus: "",
      rest: "",
    },
  });

  const total = currentPhase === "focus" ? focusTime : restTime;

  useEffect(() => {
    if (!open) {
      reset({ focus: "", rest: "" });
    }
  }, [open, reset]);

  const { alarmAudio } = useNotificationStore();

  return (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pomodoro</DialogTitle>
          <DialogDescription>
            Focus, rest and repeat to keep you on track
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => {
            if (!isValid || isRunning) return;
            resetTimer();
            setFocusTime(formatMinuteToMillis(data.focus));
            setRestTime(formatMinuteToMillis(data.rest));
            reset({ focus: "", rest: "" });
          })}
          className="space-y-4"
        >
          {/* Content */}
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex justify-center md:justify-start items-center">
                <CircularProgressBar
                  size={isDesktop ? 160 : 120}
                  strokeWidth={isDesktop ? 14 : 10}
                  total={total}
                  current={elapsedTime}
                  color={
                    currentPhase === "focus" ? "text-primary" : "text-success"
                  }
                >
                  <span className="text-xs capitalize font-light">
                    {currentPhase}
                  </span>
                  <span className="font-semibold text-lg">
                    {formatDurationLuxon(total - elapsedTime)}
                  </span>
                </CircularProgressBar>
              </div>

              <div className="capitalize px-4 py-2 bg-muted space-y-4 rounded-2xl">
                <div className="space-y-1">
                  <h1 className="text-lg font-semibold">Current Phase</h1>
                  <p className="text-sm font-light capitalize">
                    {currentPhase}
                  </p>
                  <Separator />
                </div>

                {/* Controller */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                  <Button
                    type="button"
                    size={"sm"}
                    onClick={() => {
                      setIsRunning(!isRunning);

                      if (alarmAudio) {
                        alarmAudio.pause();
                        alarmAudio.currentTime = 0;
                      }
                    }}
                  >
                    {!isRunning ? (
                      <>
                        <Play /> {isStarted ? "Resume" : "Start"}
                      </>
                    ) : (
                      <>
                        <Pause /> Pause
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant={"destructive"}
                    size={"sm"}
                    disabled={isRunning}
                    onClick={() => {
                      resetTimer();
                    }}
                  >
                    <TimerReset />
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            {/* Custom Time */}
            <div
              className={`grid grid-cols-2 gap-4 ${isRunning ? "opacity-50" : "opacity-100"} transition-all duration-300`}
            >
              {/* Focus */}
              <Controller
                control={control}
                name="focus"
                render={({ field: { value, ...field }, fieldState }) => (
                  <div>
                    <label
                      htmlFor="focus"
                      className="font-header text-lg mb-2 block"
                    >
                      Focus
                    </label>
                    <input
                      id="focus"
                      type="number"
                      min={1}
                      max={99}
                      className="font-header border py-4 w-full font-semibold text-center rounded-2xl text-4xl outer-spin-none"
                      placeholder="25"
                      disabled={isRunning}
                      value={value as string}
                      {...field}
                    />
                    <span
                      className={`text-xs ${fieldState?.error ? "text-destructive" : ""}`}
                    >
                      {fieldState?.error?.message ?? `Focus time (minute)`}
                    </span>
                  </div>
                )}
              />

              {/* Rest */}
              <Controller
                control={control}
                name="rest"
                render={({ field: { value, ...field }, fieldState }) => (
                  <div>
                    <label
                      htmlFor="rest"
                      className="font-header text-lg mb-2 block"
                    >
                      Rest
                    </label>
                    <input
                      id="rest"
                      type="number"
                      min={1}
                      max={99}
                      className="font-header border py-4 w-full font-semibold text-center rounded-2xl text-4xl outer-spin-none"
                      placeholder="5"
                      disabled={isRunning}
                      value={value as string}
                      {...field}
                    />
                    <span
                      className={`text-xs ${fieldState?.error ? "text-destructive" : ""}`}
                    >
                      {fieldState?.error?.message ?? `Rest time (minute)`}
                    </span>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="flex">
            <motion.div
              initial={{ width: 0, flex: 0, marginRight: "0px" }}
              animate={
                isValid && !isRunning
                  ? { width: "auto", flex: 1, marginRight: "8px" }
                  : { width: 0, flex: 0, marginRight: "0px" }
              }
              className="overflow-hidden"
            >
              <Button
                type="submit"
                className="w-full"
                variant={"default"}
                disabled={!isValid && isRunning}
              >
                <SaveIcon />
                Save
              </Button>
            </motion.div>

            <DialogClose asChild>
              <Button type="button" className="flex-1" variant={"outline"}>
                <Minimize />
                Minimize
              </Button>
            </DialogClose>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PomodoroDialog;
