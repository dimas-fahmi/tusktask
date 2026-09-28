import fileTypeChecker from "file-type-checker";

/**
 * Reads a File in chunks until the file type is successfully identified by magic bytes,
 * or throws an error if the end of the file is reached without detection.
 *
 * @param file File
 * @returns DetectedFileInfo
 */
export const readFileInChunks = async (file: File) => {
  const stream = file.stream();
  const reader = stream.getReader();

  let detectedFile: ReturnType<typeof fileTypeChecker.detectFile>;

  const chunks: Uint8Array[] = [];

  try {
    while (!detectedFile) {
      const { value, done } = await reader.read();

      if (value) {
        chunks.push(value);

        const totalLength = chunks.reduce(
          (acc, chunk) => acc + chunk.length,
          0,
        );

        const combinedBytes = new Uint8Array(totalLength);

        let offset = 0;

        for (const chunk of chunks) {
          combinedBytes.set(chunk, offset);
          offset += chunk.length;
        }

        detectedFile = fileTypeChecker.detectFile(combinedBytes);
      }

      if (done) {
        break;
      }
    }
  } finally {
    reader.releaseLock();
  }

  if (!detectedFile) {
    throw new Error(`Failed to gather the file information for ${file.name}`);
  }

  return detectedFile;
};
