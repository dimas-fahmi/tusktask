import sharp from "sharp";
import { SUPPORTED_IMAGE_FORMATS } from "../constants/configs";

export async function validateImageBlob(blob: Blob): Promise<sharp.Metadata> {
  const buffer = await blob.arrayBuffer().then((buf) => Buffer.from(buf));

  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    if (
      !metadata.format ||
      !SUPPORTED_IMAGE_FORMATS.includes(metadata.format)
    ) {
      throw new Error(`Unsupported image format: ${metadata.format}`);
    }

    return metadata;
  } catch (err) {
    throw new Error("Invalid image Blob or unsupported format");
  }
}
