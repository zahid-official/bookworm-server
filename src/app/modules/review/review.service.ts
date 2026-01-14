import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import { httpStatus } from "../../import";
import QueryBuilder from "../../utils/queryBuilder";
import Book from "../book/book.model";
import Reader from "../reader/reader.model";
import { IReview, ReviewStatus } from "./review.interface";
import Review from "./review.model";

const recalculateBookRatings = async (bookId: Types.ObjectId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        bookId: new Types.ObjectId(bookId),
        status: ReviewStatus.APPROVED,
      },
    },
    {
      $group: {
        _id: "$bookId",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const avgRating = stats[0]?.avgRating ?? 0;
  const count = stats[0]?.count ?? 0;
  await Book.findByIdAndUpdate(bookId, {
    averageRating: avgRating,
    ratingsCount: count,
  });
};

// Get all reviews
const getAllReviews = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder<IReview>(
    Review.find().populate({
      path: "bookId",
      select: ["title", "author", "coverImage"],
    }),
    query
  );

  if (query?.searchTerm) {
    queryBuilder.search(["review", "userName"]);
  }

  const reviews = await queryBuilder
    .sort()
    .filter()
    .paginate()
    .fieldSelect()
    .build();

  const meta = await queryBuilder.meta();
  return { data: reviews, meta };
};

// Get single review
const getSingleReview = async (id: string) => {
  const review = await Review.findById(id).populate({
    path: "bookId",
    select: ["title", "author", "coverImage"],
  });
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }
  return review;
};

// Get approved reviews by book
const getApprovedReviewsByBook = async (bookId: string) => {
  return await Review.find({
    bookId,
    status: ReviewStatus.APPROVED,
  }).sort("-createdAt");
};

// Create review
const createReview = async (userId: string, payload: IReview) => {
  const book = await Book.findById(payload.bookId);
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found");
  }

  const reader = await Reader.findOne({ userId });
  if (!reader || reader.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User profile not found");
  }

  const existingReview = await Review.findOne({
    bookId: book._id,
    userId,
  });
  if (existingReview) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already reviewed this book"
    );
  }

  const review = await Review.create({
    bookId: book._id,
    userId,
    userName: reader.name,
    profilePhoto: reader.profilePhoto,
    rating: payload.rating,
    review: payload.review,
    status: ReviewStatus.PENDING,
  });

  return review;
};

// Update review status to approve
const approveReview = async (id: string) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  if (review.status !== ReviewStatus.PENDING) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Review has already been processed"
    );
  }

  const updatedReview = await Review.findByIdAndUpdate(
    id,
    { status: ReviewStatus.APPROVED },
    { new: true }
  );

  await recalculateBookRatings(review.bookId);
  return updatedReview;
};

// Delete review
const deleteReview = async (id: string) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  const deletedReview = await Review.findByIdAndDelete(id);
  if (review.status === ReviewStatus.APPROVED) {
    await recalculateBookRatings(review.bookId);
  }

  return deletedReview;
};

// Review service object
const ReviewService = {
  getAllReviews,
  getSingleReview,
  getApprovedReviewsByBook,
  createReview,
  approveReview,
  deleteReview,
};

export default ReviewService;
