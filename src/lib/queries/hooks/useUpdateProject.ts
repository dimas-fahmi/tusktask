import { useMutation } from "@tanstack/react-query";
import { mutateProject } from "../mutators/mutateProject";

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: mutateProject,
  });
};
