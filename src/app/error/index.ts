export const APP_ERROR_CODE = {
  file: {
    failed_to_compress: 1010,
    failed_to_create_object_url: 1011,
    failed_to_create_image: 1012,
    failed_to_create_blob: 1013,
  },
} as const;

export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
    this.message = message;
  }
}

export type ErrorObjectWithMessage = {
  message: string;
};

export function isErrorObjectWithMessage(
  obj?: unknown,
): obj is ErrorObjectWithMessage {
  const _obj = obj as { message?: string };
  return !obj ? false : typeof _obj?.message === "string" && !!_obj?.message;
}
