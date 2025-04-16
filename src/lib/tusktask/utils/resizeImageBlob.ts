import sharp, { FitEnum, StrategyEnum } from "sharp";

type ResizeOptions = {
  width: number;
  height: number;
  position?: keyof typeof sharp.gravity; // e.g. 'center', 'north', etc.
  objectFit?: keyof FitEnum; // 'cover', 'contain', etc.
  sharpGravity?: keyof typeof sharp.gravity;
  sharpStrategy?: keyof StrategyEnum; // 'attention', 'entropy'
};

/**
 * Resize an image Blob using sharp with support for object-fit or smart crop.
 * @param blob Input image blob
 * @param options Resize options
 * @returns Resized image blob
 */
export async function resizeImageBlob(
  blob: Blob,
  options: ResizeOptions
): Promise<Blob> {
  const buffer = Buffer.from(await blob.arrayBuffer());
  const { width, height, position, objectFit, sharpGravity, sharpStrategy } =
    options;

  // Default fit mode
  let fit: keyof FitEnum = "cover";
  let resizeOptions: sharp.ResizeOptions = {
    width,
    height,
    fit,
  };

  if (objectFit) {
    resizeOptions.fit = objectFit;
    if ((objectFit === "cover" || objectFit === "contain") && position) {
      // Use the string key directly for position
      resizeOptions.position = position;
    }
  } else if (sharpStrategy) {
    // Use smart cropping strategy provided by sharp (attention or entropy).
    resizeOptions.fit = "cover";
    resizeOptions.position = sharp.strategy[sharpStrategy];
  } else if (sharpGravity) {
    // Use explicit sharp gravity.
    resizeOptions.fit = "cover";
    resizeOptions.position = sharp.gravity[sharpGravity];
  }

  try {
    const resizedBuffer = await sharp(buffer)
      .resize(resizeOptions)
      .webp()
      .toBuffer();
    return new Blob([resizedBuffer], { type: "image/webp" });
  } catch (err) {
    throw new Error("Failed to resize image");
  }
}
