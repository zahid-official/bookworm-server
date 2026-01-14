import AppError from "../../errors/AppError";
import { httpStatus } from "../../import";
import QueryBuilder from "../../utils/queryBuilder";
import Book from "../book/book.model";
import { ILibrary, ReadingStatus } from "./library.interface";
import Library from "./library.model";

interface CreateLibraryPayload {
  bookId: ILibrary["bookId"];
  status: ReadingStatus;
  pagesRead?: number;
}

// Get user library
const getMyLibrary = async (userId: string, query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder<ILibrary>(
    Library.find({ userId }).populate({
      path: "bookId",
      select: ["title", "author", "coverImage", "pages", "genre"],
    }),
    query
  );

  const entries = await queryBuilder
    .sort()
    .filter()
    .paginate()
    .fieldSelect()
    .build();

  const meta = await queryBuilder.meta();
  return { data: entries, meta };
};

// Add book to library
const addBookToLibrary = async (
  userId: string,
  payload: CreateLibraryPayload
) => {
  const book = await Book.findById(payload.bookId);
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found");
  }

  const existingEntry = await Library.findOne({
    userId,
    bookId: payload.bookId,
  });
  if (existingEntry) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This book already exists in your library"
    );
  }

  let pagesRead = payload.pagesRead ?? 0;
  if (pagesRead < 0 || pagesRead > book.pages) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Pages read must be between 0 and total pages"
    );
  }

  if (payload.status === ReadingStatus.WANT_TO_READ) {
    pagesRead = 0;
  }

  if (payload.status === ReadingStatus.READ) {
    pagesRead = book.pages;
  }

  const entry = await Library.create({
    userId,
    bookId: payload.bookId,
    status: payload.status,
    pagesRead,
  });

  return entry;
};

// Update library entry
const updateLibrary = async (
  userId: string,
  id: string,
  payload: Partial<ILibrary>
) => {
  const entry = await Library.findOne({ _id: id, userId });
  if (!entry) {
    throw new AppError(httpStatus.NOT_FOUND, "Library entry not found");
  }

  const book = await Book.findById(entry.bookId);
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found");
  }

  const status = payload.status ?? entry.status;
  let pagesRead = payload.pagesRead ?? entry.pagesRead;

  if (pagesRead < 0 || pagesRead > book.pages) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Pages read must be between 0 and total pages"
    );
  }

  if (status === ReadingStatus.WANT_TO_READ) {
    pagesRead = 0;
  }

  if (status === ReadingStatus.READ) {
    pagesRead = book.pages;
  }

  return await Library.findByIdAndUpdate(
    id,
    { status, pagesRead },
    { new: true, runValidators: true }
  );
};

// Delete library entry
const deleteLibrary = async (userId: string, id: string) => {
  const deletedEntry = await Library.findOneAndDelete({ _id: id, userId });
  if (!deletedEntry) {
    throw new AppError(httpStatus.NOT_FOUND, "Library entry not found");
  }
  return deletedEntry;
};

// Library service object
const LibraryService = {
  getMyLibrary,
  addBookToLibrary,
  updateLibrary,
  deleteLibrary,
};

export default LibraryService;
