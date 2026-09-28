import type { ChangeEvent } from "react";
import { AppError } from "@/src/app/error";
import type { ImgCategoryKey } from "@/src/app/image/config";
import IMG_CONFIG, { isValidRawFormat } from "@/src/app/image/config";
import { etm } from "@/src/i18n/errorTranslation/init";
import { formatBytes } from "../formatBytes";
import { readFileInChunks } from "./readFileInChunks";

export type DetectedFileInfo = Awaited<ReturnType<typeof readFileInChunks>>;

export async function handleImageInput(
  e: ChangeEvent<HTMLInputElement>,
  config: ImgCategoryKey,
  callback?: (file: File, detectedFileInfo: DetectedFileInfo) => void,
) {
  try {
    const file = Array.from(e.target.files ?? [])[0];

    if (!file) return;

    const CONFIG = IMG_CONFIG.category[config];

    if (file.size > CONFIG.raw_size) {
      throw new AppError(
        etm.file_too_large.construct(formatBytes(CONFIG.raw_size)),
      );
    }

    let detectedFileInfo: DetectedFileInfo;

    try {
      detectedFileInfo = await readFileInChunks(file);
    } catch (error) {
      console.error(error);
      throw new AppError(etm.file_unable_to_read.construct());
    }

    if (!isValidRawFormat(detectedFileInfo.extension)) {
      throw new AppError(
        etm.file_format_unsupported.construct(IMG_CONFIG.format.raw.join(", ")),
      );
    }

    callback?.(file, detectedFileInfo);
  } finally {
    e.target.value = "";
  }
}
