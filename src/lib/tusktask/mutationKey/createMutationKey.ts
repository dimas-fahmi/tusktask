import { MutationKey } from "@tanstack/react-query";

type MutationKeyParams = {
  branch: string;
  structure: string;
};

/**
 * Creates a structured mutation key for React Query.
 * Example: { branch: "fruit", structure: "apple/banana/watermelon" }
 * Returns: ["task", "apple", "banana", "watermelon"]
 */
export function createMutationKey({
  branch,
  structure,
}: MutationKeyParams): MutationKey {
  const structureParts = structure.split("/").filter(Boolean);
  return [branch, ...structureParts];
}
