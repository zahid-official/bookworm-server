import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { ZodObject } from "zod";

// Zod schema validation middleware
const validateSchema = (zodSchema: ZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // If the request body contains a 'data' field, parse it as JSON
    if (req.body?.data) {
      req.body = JSON.parse(req.body.data);
    }

    // Validate the request body against the provided Zod schema
    req.body = await zodSchema.parseAsync(req.body);
    next();
  });
};

export default validateSchema;
