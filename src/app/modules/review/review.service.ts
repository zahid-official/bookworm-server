import AppError from "../../errors/AppError";
import { httpStatus } from "../../import";
import QueryBuilder from "../../utils/queryBuilder";
import Book from "../book/book.model";
import Reader from "../reader/reader.model";
import { IReview, ReviewStatus } from "./review.interface";
import Review from "./review.model";

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
    rating: payload.rating,
    review: payload.review,
    status: ReviewStatus.PENDING,
  });

  return review;
};

// Review service object
const ReviewService = {
  getAllReviews,
  getSingleReview,
  getApprovedReviewsByBook,
  createReview,
};

export default ReviewService;
