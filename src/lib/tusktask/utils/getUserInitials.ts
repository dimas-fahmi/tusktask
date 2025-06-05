export function getUserInitials(name?: string | null | undefined): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  const initials = parts.map((part) => part[0]?.toLowerCase() || "").join("");
  return initials;
}
