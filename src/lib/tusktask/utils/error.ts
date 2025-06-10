export class CustomError extends Error {
  statusCode: number;

  constructor(name: string, message: string, statusCode = 500) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}
