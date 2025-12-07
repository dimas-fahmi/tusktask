export interface FileMetadata {
  name: string;
  size: number; // in bytes
  type: string; // MIME type
  extension?: string | null;
  lastModified: number; // timestamp
  lastModifiedDate: Date | null;
  previewUrl?: string; // Object URL for previewing images/videos
}

export const getFileMetadata = (file: File): FileMetadata => {
  const { name, size, type, lastModified } = file;

  const extension = name.includes(".") ? name.split(".").pop() : null;

  const lastModifiedDate = lastModified ? new Date(lastModified) : null;

  // Optional preview URL if file is an image or video
  const previewUrl =
    type.startsWith("image/") || type.startsWith("video/")
      ? URL.createObjectURL(file)
      : undefined;

  return {
    name,
    size,
    type,
    extension,
    lastModified,
    lastModifiedDate,
    previewUrl,
  };
};
