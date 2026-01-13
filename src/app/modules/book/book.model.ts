import { Schema, model } from "mongoose";
import { IBook } from "./book.interface";

// Mongoose schema for book model
const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: { type: Schema.Types.ObjectId, ref: "Genre", required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    pages: { type: Number, required: true, min: 1 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    ratingsCount: { type: Number, default: 0, min: 0 },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Create mongoose model from book schema
const Book = model<IBook>("Book", bookSchema);
export default Book;
