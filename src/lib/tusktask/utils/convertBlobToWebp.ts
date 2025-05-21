import sharp from "sharp";

export async function convertBlobToWebP(blob: Blob): Promise<Blob> {
  // Convert Blob to Buffer for sharp
  const buffer = await blob.arrayBuffer().then((buf) => Buffer.from(buf));

  try {
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 80 }) // You can tweak quality as needed
      .toBuffer();

    // Convert back to Blob
    return new Blob([webpBuffer], { type: "image/webp" });
  } catch (err) {
    throw new Error("Failed to convert image to WebP");
  }
}
