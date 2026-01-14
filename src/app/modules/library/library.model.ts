import { Schema, model } from "mongoose";
import { ILibrary, ReadingStatus } from "./library.interface";

// Mongoose schema for library model
const librarySchema = new Schema<ILibrary>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    status: {
      type: String,
      enum: Object.values(ReadingStatus),
      required: true,
    },
    pagesRead: { type: Number, default: 0, min: 0 },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

librarySchema.index({ userId: 1, bookId: 1 }, { unique: true });

// Create mongoose model from library schema
const Library = model<ILibrary>("Library", librarySchema);
export default Library;
