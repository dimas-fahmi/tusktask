import TaskCard from "@/src/ui/components/ui/TaskCard";

const TasksCollection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Today */}
      <div className="space-y-3">
        <header>
          <h1 className="text-2xl">Today</h1>
        </header>

        <div className="space-y-4">
          <TaskCard />
          <TaskCard />
          <TaskCard />
        </div>
      </div>

      {/* Tomorrow */}
      <div className="space-y-3">
        <header>
          <h1 className="text-2xl">Tomorrow</h1>
        </header>

        <div className="space-y-4">
          <TaskCard />
          <TaskCard />
        </div>
      </div>

      {/* Upcoming */}
      <div className="space-y-3">
        <header>
          <h1 className="text-2xl">Upcoming</h1>
        </header>
        <div className="space-y-4">
          <TaskCard />
          <TaskCard />
          <TaskCard />
          <TaskCard />
          <TaskCard />
          <TaskCard />
          <TaskCard />
        </div>
      </div>
    </div>
  );
};

export default TasksCollection;
