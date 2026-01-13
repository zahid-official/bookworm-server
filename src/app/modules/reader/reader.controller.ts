import { Request, Response } from "express";
import { httpStatus } from "../../import";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import ReaderService from "./reader.service";

// Create reader
const createReader = catchAsync(async (req: Request, res: Response) => {
  const payload = req?.body || {};
  if (req.file?.path) {
    payload.profilePhoto = req.file.path;
  }
  const { password, ...body } = payload;
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
