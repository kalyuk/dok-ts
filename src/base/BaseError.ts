export class BaseError extends Error {
  constructor(public code, public message) {
    super(message);
  }
}