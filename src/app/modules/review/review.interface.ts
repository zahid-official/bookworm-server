import { Types } from "mongoose";

// Review status enum
export enum ReviewStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
}

// Review interface definition
export interface IReview {
  _id?: Types.ObjectId;
  bookId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  profilePhoto?: string;
  rating: number;
  review: string;
  status: ReviewStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
