import { QueryKey } from "@tanstack/react-query";

type QueryKeyParams = {
  branch: string;
  structure: string;
};

/**
 * Creates a structured query key for React Query.
 * Example: { branch: "fruit", structure: "apple/banana/watermelon" }
 * Returns: ["task", "apple", "banana", "watermelon"]
 */
export function createQueryKey({
  branch,
  structure,
}: QueryKeyParams): QueryKey {
  const structureParts = structure.split("/").filter(Boolean);
  return [branch, ...structureParts];
}
