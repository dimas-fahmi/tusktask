export const includeFields = (
  data: Record<string, any>,
  fields: string[]
): string[] => {
  return fields.filter((field) => field in data);
};
