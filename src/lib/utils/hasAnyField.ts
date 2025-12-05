/**
 * Checks if an object contains AT LEAST ONE of the fields specified in an array of keys.
 *
 * @param targetObject The object to check. It can be of any type, as long as it behaves like an object.
 * @param potentialFields An array of strings representing the field keys. The function returns true if any one of these keys exists.
 * @returns true if the object contains at least one of the specified fields, false otherwise.
 */
export function hasAnyField(
  targetObject: unknown,
  potentialFields: string[],
): boolean {
  if (typeof targetObject !== "object" || targetObject === null) {
    return false;
  }

  const obj = targetObject as Record<string, unknown>;

  return potentialFields.some((field) => {
    return field in obj;
  });
}
