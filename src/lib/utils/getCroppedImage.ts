import type { Options } from "browser-image-compression";
import z from "zod";
import type { CropperStatus } from "../stores/imageUploadModal";

const _qualityRange = z.number().min(0).max(0.9);
export type BaseQuality = z.infer<typeof _qualityRange>;

export interface GetCroppedImgSettings {
  fileName?: string;
  baseQuality?: BaseQuality;
  compressionOptions?: Options;
}

export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  setStatus: (n: CropperStatus) => void,
  settings?: GetCroppedImgSettings,
): Promise<{ url: string; blob: Blob; file: File }> => {
  // Settings
  const fileName = settings?.fileName ?? crypto.randomUUID();
  const baseQuality = settings?.baseQuality ?? 0.9;

  // Recreate Image to crop with canvas
  let image: HTMLImageElement;
  try {
    setStatus({ code: "on_process", message: "Processing", progress: 10 });
    image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  } catch (_error) {
    throw new Error("Failed to create image instance for canvas");
  }

  if (typeof image.decode === "function") await image.decode();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  // Convert canvas to blob
  let blob: Blob;

  try {
    setStatus({
      code: "on_process",
      message: "converting",
      progress: 20,
    });
    blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Failed to create blob"))),
        "image/webp",
        baseQuality,
      );
    });
  } catch (_error) {
    throw new Error("Failed to convert canvas to blob");
  }

  // Convert blob to file
  let file: File;
  try {
    file = new File([blob], `${fileName}.webp`, {
      type: blob.type,
      lastModified: Date.now(),
    });
  } catch (_error) {
    throw new Error("Failed to get file instance from blob");
  }

  // Create Object URL
  const url = URL.createObjectURL(file);

  return { url, blob, file };
};
