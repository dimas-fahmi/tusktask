export function extractFieldValues(
  array: Record<string, any>[],
  field: string
) {
  if (!Array.isArray(array)) {
    throw new TypeError("Expected 'array' to be an array");
  }

  return array.map((item) => item[field]);
}
