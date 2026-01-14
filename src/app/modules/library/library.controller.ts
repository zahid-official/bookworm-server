import { Request, Response } from "express";
import { httpStatus } from "../../import";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import LibraryService from "./library.service";

// Get user library
const getMyLibrary = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.decodedToken?.userId;
  const query = req?.query;
  const result = await LibraryService.getMyLibrary(
    userId,
    query as Record<string, string>
  );

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Library retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// Add book to library
const addBookToLibrary = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.decodedToken?.userId;
  const result = await LibraryService.addBookToLibrary(userId, req?.body);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Book added to library successfully",
    data: result,
  });
});

// Update library entry
const updateLibrary = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.decodedToken?.userId;
  const id = req?.params?.id as string;
  const result = await LibraryService.updateLibrary(userId, id, req?.body);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Library updated successfully",
    data: result,
  });
});

// Delete library entry
const deleteLibrary = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.decodedToken?.userId;
  const id = req?.params?.id as string;
  const result = await LibraryService.deleteLibrary(userId, id);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Book removed from library successfully",
    data: result,
  });
});

// Library controller object
const LibraryController = {
  getMyLibrary,
  addBookToLibrary,
  updateLibrary,
  deleteLibrary,
};

export default LibraryController;
