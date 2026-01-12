import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import envVars from "../config/env";
import { ZodError } from "zod";
import { cloudinaryDelete } from "../config/cloudinary";

// Global error handling middleware
const globalErrorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if response sent
  if (res.headersSent) {
    return next(error);
  }

  // Default error values
  let statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = error.message || "Something went wrong!!";
  let errorDetails = error;

  // Delete single uploaded file from cloudinary
  if (req.file) {
    await cloudinaryDelete(req.file.path);
  }

  // Delete multiple uploaded files from cloudinary
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    await Promise.all(
      (req.files as Express.Multer.File[]).map((file) => {
        cloudinaryDelete(file.path);
      })
    );
  }

  // Zod validation error handling
  if (error instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation failed";
    errorDetails = error.issues;
  }

  // Mongoose duplicate key error handling
  else if (error.code && error.code === 11000) {
    statusCode = httpStatus.BAD_REQUEST;
    message = `${Object.values(
      error.keyValue
    )} is already associated with an existing one. Please use another value.`;
  }

  // Mongoose cast error handling
  else if (error.name === "CastError") {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Invalid ObjectID. Please provide a valid MongoDB ObjectID";
  }

  // JWT error handling
  else if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    statusCode = httpStatus.UNAUTHORIZED;
    message = error.message;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails,
    stack:
      envVars.NODE_ENV === "development"
        ? error.stack
            ?.split("\n")
            .map((line: any) => line.trim())
            .filter((line: any) => line.startsWith("at"))
        : null,
  });
};

export default globalErrorHandler;
