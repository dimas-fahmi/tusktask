export function objectToQueryString(obj: unknown) {
  if (typeof obj !== "object") {
    return "";
  }
  const object = obj as Record<string, string>;
  return Object.entries(object)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
}
