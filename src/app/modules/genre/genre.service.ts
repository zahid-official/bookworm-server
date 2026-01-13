import AppError from "../../errors/AppError";
import { httpStatus } from "../../import";
import QueryBuilder from "../../utils/queryBuilder";
import Genre from "./genre.model";
import { IGenre } from "./genre.interface";

// Get all genres
const getAllGenres = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder<IGenre>(
    Genre.find({ isDeleted: { $ne: true } }),
    query
  );

  if (query?.searchTerm) {
    queryBuilder.search(["name", "description"]);
  }

  const genres = await queryBuilder
    .sort()
    .filter()
    .paginate()
    .fieldSelect()
    .build();

  const meta = await queryBuilder.meta();
  return { data: genres, meta };
};

// Get single genre
const getSingleGenre = async (id: string) => {
  const genre = await Genre.findById(id).where({ isDeleted: { $ne: true } });
  if (!genre) {
    throw new AppError(httpStatus.NOT_FOUND, "Genre not found");
  }
  return genre;
};

// Create genre
const createGenre = async (payload: IGenre) => {
  const existingGenre = await Genre.findOne({ name: payload.name });
  if (existingGenre) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Genre '${payload.name}' already exists`
    );
  }

  const genre = await Genre.create(payload);
  return genre;
};

// Update genre
const updateGenre = async (id: string, payload: Partial<IGenre>) => {
  const existingGenre = await Genre.findById(id).where({
    isDeleted: { $ne: true },
  });
  if (!existingGenre) {
    throw new AppError(httpStatus.NOT_FOUND, "Genre not found");
  }

  // Check for duplicate name
  if (payload.name) {
    const duplicateGenre = await Genre.findOne({
      name: payload.name,
      _id: { $ne: id },
    });

    if (duplicateGenre) {
      throw new AppError(
        httpStatus.CONFLICT,
        `Genre '${payload.name}' already exists`
      );
    }
  }

  return await Genre.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

// Genre service object
const GenreService = {
  getAllGenres,
  getSingleGenre,
  createGenre,
  updateGenre,
};

export default GenreService;
