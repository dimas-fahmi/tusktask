/**
 * Checks if an object contains all the fields specified in an array of keys.
 *
 * @param targetObject The object to check. It can be of any type, as long as it behaves like an object.
 * @param requiredFields An array of strings representing the field keys that must exist in the object.
 * @returns true if the object contains all required fields, false otherwise.
 */
export function hasAllFields(
  targetObject: unknown,
  requiredFields: string[],
): boolean {
  if (typeof targetObject !== "object" || targetObject === null) {
    console.log("hahah");
    return false;
  }
  const obj = targetObject as Record<string, unknown>;
  return requiredFields.every((field) => {
    return field in obj;
  });
}
