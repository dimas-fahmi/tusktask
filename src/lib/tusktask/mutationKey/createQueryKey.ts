type QueryKeyParams = {
  branch: string;
  structure: string;
  withBranch?: boolean;
};

/**
 * Creates a structured query key for React Query.
 * Example: { branch: "fruit", structure: "apple/banana/watermelon" }
 * Returns: ["task", "apple", "banana", "watermelon"]
 */
export function createQueryKey({
  branch,
  structure,
  withBranch = true,
}: QueryKeyParams): string[] {
  const structureParts = structure.split("/").filter(Boolean);
  return withBranch ? [branch, ...structureParts] : [...structureParts];
}
