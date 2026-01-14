import { Request, Response } from "express";
import { httpStatus } from "../../import";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import ReviewService from "./review.service";

// Get all reviews
const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const query = req?.query;
  const result = await ReviewService.getAllReviews(
    query as Record<string, string>
  );

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All reviews retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// Get single review
const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id as string;
  const result = await ReviewService.getSingleReview(id);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review retrieved successfully",
    data: result,
  });
});

// Get approved reviews by book
const getApprovedReviewsByBook = catchAsync(
  async (req: Request, res: Response) => {
    const bookId = req?.params?.bookId as string;
    const result = await ReviewService.getApprovedReviewsByBook(bookId);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Approved reviews retrieved successfully",
      data: result,
    });
  }
);

// Create review
const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.decodedToken?.userId;
  const result = await ReviewService.createReview(userId, req?.body);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review submitted successfully",
    data: result,
  });
});

// Update review status to approve
const approveReview = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id as string;
  const result = await ReviewService.approveReview(id);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review approved successfully",
    data: result,
  });
});

// Delete review
const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id as string;
  const result = await ReviewService.deleteReview(id);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review deleted successfully",
    data: result,
  });
});

// Review controller object
const ReviewController = {
  getAllReviews,
  getSingleReview,
  getApprovedReviewsByBook,
  createReview,
  approveReview,
  deleteReview,
};

export default ReviewController;
