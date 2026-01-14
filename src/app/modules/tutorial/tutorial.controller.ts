import { Request, Response } from "express";
import { httpStatus } from "../../import";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import TutorialService from "./tutorial.service";

// Get all tutorials
const getAllTutorials = catchAsync(async (req: Request, res: Response) => {
  const query = req?.query;
  const result = await TutorialService.getAllTutorials(
    query as Record<string, string>
  );

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All tutorials retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// Get single tutorial
const getSingleTutorial = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id as string;
  const result = await TutorialService.getSingleTutorial(id);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tutorial retrieved successfully",
    data: result,
  });
});

// Create tutorial
const createTutorial = catchAsync(async (req: Request, res: Response) => {
  const result = await TutorialService.createTutorial(req?.body);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Tutorial created successfully",
    data: result,
  });
});

// Update tutorial
const updateTutorial = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id as string;
  const result = await TutorialService.updateTutorial(id, req?.body);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tutorial updated successfully",
    data: result,
  });
});

// Delete tutorial
const deleteTutorial = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id as string;
  const result = await TutorialService.deleteTutorial(id);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tutorial deleted successfully",
    data: result,
  });
});

// Tutorial controller object
const TutorialController = {
  getAllTutorials,
  getSingleTutorial,
  createTutorial,
  updateTutorial,
  deleteTutorial,
};

export default TutorialController;
