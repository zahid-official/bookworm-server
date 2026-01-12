// AppError class to standard error handling across the application
class AppError extends Error {
  constructor(public statusCode: number, message: string, stack = "") {
    super(message);
    this.statusCode = statusCode;

    // Use custom stack if available
    if (stack) {
      this.stack = stack;
    } else {
      // Generate stack trace
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
