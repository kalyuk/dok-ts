export type ErrorType = {
  message: string;
  field: string;
};

export class BaseError extends Error {
  constructor(public code: number, public message: string, public errors: ErrorType[] = []) {
    super(message);
  }
}