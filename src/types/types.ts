import { UseMutateFunction } from "@tanstack/react-query";
import { StandardResponse } from "../lib/tusktask/utils/createResponse";
import { TasksDeleteRequest } from "@/app/api/tasks/delete";

export type SetStateAction<T> = React.Dispatch<React.SetStateAction<T>>;

export interface CreatedByOptimisticUpdate {
  createdByOptimisticUpdate?: boolean;
}

export type MutateFunction<T, R> = UseMutateFunction<
  StandardResponse<T>,
  unknown,
  R,
  unknown
>;
