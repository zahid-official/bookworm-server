import AppError from "../../errors/AppError";
import { httpStatus } from "../../import";
import Genre from "../genre/genre.model";
import { IBook } from "./book.interface";
import Book from "./book.model";

// Create book
const createBook = async (payload: IBook) => {
  if (!payload.coverImage) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cover image is required");
  }

  const existingBook = await Book.findOne({
    title: payload.title,
    author: payload.author,
  });
  if (existingBook) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Book '${payload.title}' by '${payload.author}' already exists`
    );
  }

  // Check if genre exists
  const genre = await Genre.findById(payload.genre);
  if (!genre) {
    throw new AppError(httpStatus.NOT_FOUND, "Genre not found");
  }

  const book = await Book.create(payload);
  return book;
};

// Book service object
const BookService = {
  createBook,
};

export default BookService;
