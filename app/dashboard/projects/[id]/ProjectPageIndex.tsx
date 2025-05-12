"use client";

import { SpecificProjectGetData } from "@/app/api/projects/[id]/route";
import { fetchSpecificProject } from "@/src/lib/tusktask/fetchers/fetchSpecificProject";
import useTasksContext from "@/src/lib/tusktask/hooks/context/useTasksContext";
import { useCategorizeTasks } from "@/src/lib/tusktask/hooks/data/useCategorizeTasks";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { Separator } from "@/src/ui/components/shadcn/ui/separator";
import TaskCheckButton from "@/src/ui/components/tusktask/buttons/TaskCheckButton";
import AssigneeCard from "@/src/ui/components/tusktask/cards/AssigneeCard";
import TaskCard from "@/src/ui/components/tusktask/cards/TaskCard";
import StatusOverview from "@/src/ui/components/tusktask/generics/StatusOverview";
import { useQuery } from "@tanstack/react-query";
import { Folder, MessageCircleMore, Text } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProjectPageIndex = ({ id }: { id: string }) => {
  // Pull Session
  const { data: session } = useSession();

  // Pull trigger and setters from taskContext
  const { setNewTaskDialogOpen, setIsProjectTask } = useTasksContext();

  // Initialize query
  const { data, isFetched, isFetching } = useQuery({
    queryKey: ["projects", id],
    queryFn: () => {
      return fetchSpecificProject(id);
    },
    enabled: !!id,
  });

  const projectData =
    data && data.data ? (data.data as SpecificProjectGetData) : null;

  const router = useRouter();

  useEffect(() => {
    if (isFetched && !isFetching && !projectData) {
      router.push("/404");
    }
  }, [projectData, isFetched, isFetching]);

  const newTaskHandler = () => {
    setIsProjectTask({ isProject: true, projectId: id });
    setNewTaskDialogOpen(true);
  };

  const { completed, overdue, today, tomorrow, upcoming } = useCategorizeTasks(
    projectData?.tasks
  );

  return (
    <div className="grid gric-cols-1 md:grid-cols-[auto_320px] gap-4">
      <div>
        <header className="grid grid-cols-1 gap-4 mb-4">
          <div className="flex items-center justify-between">
            <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-tt-primary-foreground/80">
              <Folder size={"2rem"} />
              {projectData?.name}
            </h1>
          </div>
          <p className="flex text-sm text-muted-foreground items-center gap-2">
            <Text size={"1rem"} />
            {projectData?.description}
          </p>
        </header>
        <Separator />
        <div className="py-4">
          {projectData?.tasks.length === 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                No task for this project
              </span>

              <Button variant={"default"} size={"sm"}>
                New Project Task
              </Button>
            </div>
          )}

          {/* Task Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectData &&
              projectData?.tasks.length > 0 &&
              projectData?.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>
        </div>
        <Separator />
      </div>
      <aside className="flex flex-col gap-4">
        {/* Task Overview */}
        <StatusOverview
          overdue={overdue.length}
          today={today.length}
          upcoming={tomorrow.length + upcoming.length}
        />

        {/* New Task Button */}
        <Button
          variant={"default"}
          size={"sm"}
          onClick={() => newTaskHandler()}
        >
          New Project Task
        </Button>

        <section>
          <h2 className="font-semibold mb-1">Assigne</h2>
          {/* Asignee Card */}
          <AssigneeCard
            name={session?.user.name ?? "Loading"}
            avatar={session?.user.image ?? ""}
            username={session?.user.userName ?? ""}
            creator={true}
            owner={true}
            key={"haha"}
          />
        </section>
      </aside>
    </div>
  );
};

export default ProjectPageIndex;
