export const getPriorityClassification = (priority: number) => {
  if (priority < 5) {
    return "critical";
  }

  if (priority < 10) {
    return "high";
  }

  if (priority < 20) {
    return "medium";
  }

  if (priority < 40) {
    return "low";
  }

  return "backlog";
};
