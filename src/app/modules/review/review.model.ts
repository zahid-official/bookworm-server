import { Schema, model } from "mongoose";
import { IReview, ReviewStatus } from "./review.interface";

// Mongoose schema for review model
const reviewSchema = new Schema<IReview>(
  {
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true, trim: true },
    profilePhoto: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(ReviewStatus),
      default: ReviewStatus.PENDING,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Create mongoose model from review schema
const Review = model<IReview>("Review", reviewSchema);
export default Review;
