import { Request, Response } from "express";
import { httpStatus } from "../../import";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import ReaderService from "./reader.service";

// Create reader
const createReader = catchAsync(async (req: Request, res: Response) => {
  const { password, ...body } = req?.body || {};
  const result = await ReaderService.createReader(body, password);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Account created successfully",
    data: result,
  });
});

// Reader controller object
const ReaderController = {
  createReader,
};

export default ReaderController;
