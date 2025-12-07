export type DetectURLType = "ObjectURL" | "HttpURL" | "Unknown" | "Invalid";

export function detectURLType(url: string): DetectURLType {
  if (typeof url !== "string") return "Invalid";

  if (url.startsWith("blob:")) {
    return "ObjectURL";
  } else if (url.startsWith("http://") || url.startsWith("https://")) {
    return "HttpURL";
  } else {
    return "Unknown";
  }
}
