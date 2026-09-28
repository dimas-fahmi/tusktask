import imageCompression, { type Options } from "browser-image-compression";
import { APP_ERROR_CODE, AppError } from "@/src/app/error";
import { etm } from "@/src/i18n/errorTranslation/init";

let compressImageAbort: AbortController | null = null;

export function abortImageCompression() {
  if (compressImageAbort) {
    compressImageAbort.abort("abort");
  }
}

export async function compressImage(
  file: File,
  options: Options,
): Promise<File> {
  let compressed: File | null = null;

  const error = new AppError(
    etm.file_unable_to_process.construct(
      APP_ERROR_CODE.file.failed_to_compress,
    ),
  );

  try {
    try {
      abortImageCompression();

      compressImageAbort = new AbortController();

      compressed = await imageCompression(file, {
        useWebWorker: true,
        signal: compressImageAbort.signal,
        fileType: "image/jpeg",
        ...options,
      });
    } catch (error) {
      if (error !== "abort") {
        console.error(error);

        throw error;
      }
    }
  } finally {
    compressImageAbort = null;
  }

  if (!compressed) {
    throw error;
  }

  return compressed;
}
