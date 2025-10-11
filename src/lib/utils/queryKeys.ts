export const queryKeys = {
  tasks: {
    all: ["tasks"] as const,
    project: (projectId: string) => [
      ...queryKeys.tasks.all,
      `project-${projectId}`,
    ],
    detail: (taskId: string) => [...queryKeys.tasks.all, `task-${taskId}`],
  },
  projects: {
    all: ["projects"] as const,
    detail: (projectId: string) => [...queryKeys.projects.all, projectId],
  },
};
