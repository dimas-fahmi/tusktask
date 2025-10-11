import { TaskApp } from "@/src/lib/types/tasks";
import React from "react";
import NameAndDescriptionCard from "../components/NameAndDescriptionCard";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/src/ui/shadcn/components/ui/card";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Archive, PlusCircle, Settings2 } from "lucide-react";
import InformationTable from "@/src/ui/components/Dashboard/InformationTable";
import { useTaskStore } from "@/src/lib/stores/ui/taskStore";

const HeaderSection = ({ task }: { task?: TaskApp }) => {
  const { setNewTaskDialogOpen, setParentTask, setActiveProject } =
    useTaskStore();

  return (
    <header className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Name & Description */}
      <NameAndDescriptionCard task={task} />

      {/* Countdown */}
      <Card className="h-fit">
        <CardHeader className="flex items-center justify-between">
          <h1 className="font-header text-2xl">Information</h1>
          <Button variant={"outline"} size={"sm"}>
            <Settings2 />
            Settings
          </Button>
        </CardHeader>
        <CardContent>
          <InformationTable
            deadline={task?.deadlineAt}
            priorityLevel={task?.taskPriority}
            status={task?.taskPriority}
          />

          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button variant={"outline"}>
              <Archive /> Archive
            </Button>
            <Button
              onClick={() => {
                setActiveProject(task?.project);
                setParentTask(task || null);
                setNewTaskDialogOpen(true);
              }}
            >
              <PlusCircle /> New Subtask
            </Button>
          </div>
        </CardContent>
      </Card>
    </header>
  );
};

export default HeaderSection;
