import { Request, Response } from "express";
import { httpStatus } from "../../import";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import GenreService from "./genre.service";

// Get all genres
const getAllGenres = catchAsync(async (req: Request, res: Response) => {
  const query = req?.query;
  const result = await GenreService.getAllGenres(
    query as Record<string, string>
  );

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All genres retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// Get single genre
const getSingleGenre = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id as string;
  const result = await GenreService.getSingleGenre(id);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Genre retrieved successfully",
    data: result,
  });
});

// Create genre
const createGenre = catchAsync(async (req: Request, res: Response) => {
  const result = await GenreService.createGenre(req?.body);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Genre created successfully",
    data: result,
  });
});

// Update genre
const updateGenre = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id as string;
  const result = await GenreService.updateGenre(id, req?.body);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Genre updated successfully",
    data: result,
  });
});

// Delete genre
const deleteGenre = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id as string;
  const result = await GenreService.deleteGenre(id);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Genre deleted successfully",
    data: result,
  });
});

// Genre controller object
const GenreController = {
  getAllGenres,
  getSingleGenre,
  createGenre,
  updateGenre,
  deleteGenre,
};

export default GenreController;
