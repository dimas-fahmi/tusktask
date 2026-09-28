import type { Area } from "react-easy-crop";
import { APP_ERROR_CODE, AppError } from "@/src/app/error";
import { etm } from "@/src/i18n/errorTranslation/init";

function createImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => resolve(image));

    image.addEventListener("error", () => {
      reject(
        new AppError(
          etm.file_unable_to_process.construct(
            APP_ERROR_CODE.file.failed_to_create_image,
          ),
        ),
      );
    });

    image.setAttribute("crossOrigin", "anonymous");

    image.src = url;
  });
}

export async function getCroppedImage({
  area,
  src,
}: {
  area: Area;
  src: string;
}) {
  const img = await createImage(src);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new AppError(etm.no_canvas_context.construct());
  }

  canvas.width = area.width;
  canvas.height = area.height;

  ctx.drawImage(
    img,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    area.width,
    area.height,
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return reject(
            new AppError(
              etm.file_unable_to_process.construct(
                APP_ERROR_CODE.file.failed_to_create_blob,
              ),
            ),
          );
        }

        resolve(blob);
      },
      "image/jpeg",
      0.8,
    );
  });
}
