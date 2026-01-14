import AppError from "../../errors/AppError";
import { httpStatus } from "../../import";
import Genre from "../genre/genre.model";
import { IBook } from "./book.interface";
import Book from "./book.model";
import QueryBuilder from "../../utils/queryBuilder";

// Get all books
const getAllBooks = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder<IBook>(
    Book.find().populate({
      path: "genre",
      select: ["name"],
    }),
    query
  );

  if (query?.searchTerm) {
    queryBuilder.search(["title", "author", "description"]);
  }

  const books = await queryBuilder
    .sort()
    .filter()
    .paginate()
    .fieldSelect()
    .build();

  const meta = await queryBuilder.meta();
  return { data: books, meta };
};

// Get single book
const getSingleBook = async (id: string) => {
  const book = await Book.findById(id).populate({
    path: "genre",
    select: ["name"],
  });
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found");
  }
  return book;
};

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

// Update book
const updateBook = async (id: string, payload: Partial<IBook>) => {
  const existingBook = await Book.findById(id);
  if (!existingBook) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found");
  }

  if (payload.title && payload.author) {
    const duplicateBook = await Book.findOne({
      title: payload.title,
      author: payload.author,
      _id: { $ne: id },
    });
    if (duplicateBook) {
      throw new AppError(
        httpStatus.CONFLICT,
        `Book '${payload.title}' by '${payload.author}' already exists`
      );
    }
  }

  // Check if genre exists
  if (payload.genre) {
    const genre = await Genre.findById(payload.genre);
    if (!genre) {
      throw new AppError(httpStatus.NOT_FOUND, "Genre not found");
    }
  }

  return await Book.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

// Delete book
const deleteBook = async (id: string) => {
  const book = await Book.findById(id);
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found");
  }

  return await Book.findByIdAndDelete(id);
};

// Book service object
const BookService = {
  getAllBooks,
  getSingleBook,
  createBook,
  updateBook,
  deleteBook,
};

export default BookService;
