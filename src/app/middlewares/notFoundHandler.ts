import { Request, Response } from "express";
import httpStatus from "http-status-codes";

// Not Found error handling middleware
const notFoundHandler = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Route not found",
    error: {
      name: "404 Not found",
      message: "The requested route does not exist on the server",
      path: req.originalUrl,
      method: req.method,
    },
  });
};

export default notFoundHandler;
