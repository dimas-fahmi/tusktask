export const checkProtectedFields = (
  body: Record<string, any>,
  protectedFields: string[]
) => {
  for (const field of protectedFields) {
    if (field in body) return field;
  }
  return null;
};
