export const APP_ERROR_CODE = {
  file: {
    failed_to_compress: 1010,
  },
} as const;

export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
    this.message = message;
  }
}
