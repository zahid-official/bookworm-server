import { Request, Response } from "express";
import { httpStatus } from "../../import";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import BookService from "./book.service";

// Create book
const createBook = catchAsync(async (req: Request, res: Response) => {
  const payload = req?.body || {};
  if (req.file?.path) {
    payload.coverImage = req.file.path;
  }
  const result = await BookService.createBook(payload);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Book created successfully",
    data: result,
  });
});

// Book controller object
const BookController = {
  createBook,
};

export default BookController;
