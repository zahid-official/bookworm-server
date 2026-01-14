import { Request, Response } from "express";
import { httpStatus } from "../../import";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import BookService from "./book.service";

// Get all books
const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const query = req?.query;
  const result = await BookService.getAllBooks(query as Record<string, string>);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All books retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// Get single book
const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id as string;
  const result = await BookService.getSingleBook(id);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Book retrieved successfully",
    data: result,
  });
});

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

// Update book
const updateBook = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id as string;
  const payload = req?.body || {};
  if (req.file?.path) {
    payload.coverImage = req.file.path;
  }
  const result = await BookService.updateBook(id, payload);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Book updated successfully",
    data: result,
  });
});

// Delete book
const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id as string;
  const result = await BookService.deleteBook(id);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Book deleted successfully",
    data: result,
  });
});

// Book controller object
const BookController = {
  getAllBooks,
  getSingleBook,
  createBook,
  updateBook,
  deleteBook,
};

export default BookController;
