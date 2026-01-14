import { Types } from "mongoose";

// Reading status enum
export enum ReadingStatus {
  WANT_TO_READ = "WANT_TO_READ",
  CURRENTLY_READING = "CURRENTLY_READING",
  READ = "READ",
}

// Library interface definition
export interface ILibrary {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
  status: ReadingStatus;
  pagesRead: number;
  createdAt?: Date;
}
