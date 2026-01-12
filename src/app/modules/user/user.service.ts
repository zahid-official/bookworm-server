import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import { httpStatus } from "../../import";
import QueryBuilder from "../../utils/queryBuilder";
import Admin from "../admin/admin.model";
import Reader from "../reader/reader.model";
import { IUser, Role } from "./user.interface";
import User from "./user.model";

// Build user search filter based on search term
const buildUserSearchFilter = async (
  searchTerm?: string,
  includeDeletedProfiles = false
) => {
  if (!searchTerm || !searchTerm.trim()) {
    return {};
  }

  const regex = new RegExp(searchTerm, "i");
  const profileMatch = {
    isDeleted: includeDeletedProfiles ? true : { $ne: true },
    $or: [
      { name: regex },
      { email: regex },
      { phone: regex },
      { address: regex },
    ],
  };

  const [admins, readers] = await Promise.all([
    Admin.find(profileMatch).select("userId"),
    Reader.find(profileMatch).select("userId"),
  ]);

  const userIds = new Set<string>();
  admins.forEach((admin) => userIds.add(admin.userId.toString()));
  readers.forEach((reader) => userIds.add(reader.userId.toString()));

  const orConditions: Record<string, unknown>[] = [
    { email: { $regex: regex } },
  ];

  if (userIds.size > 0) {
    orConditions.push({ _id: { $in: Array.from(userIds) } });
  }

  return { $or: orConditions };
};

// Get all users
const getAllUsers = async (query: Record<string, string>) => {
  const searchFilter = await buildUserSearchFilter(query?.searchTerm);

  // Build the query using QueryBuilder class and fetch users
  const queryBuilder = new QueryBuilder<IUser>(
    User.find({ isDeleted: { $ne: true }, ...searchFilter }).populate([
      {
        path: "admin",
        match: { isDeleted: { $ne: true } },
        select: ["name", "email", "phone", "address", "profilePhoto"],
      },
      {
        path: "reader",
        match: { isDeleted: { $ne: true } },
        select: ["name", "email", "phone", "address", "profilePhoto"],
      },
    ]),
    query
  );
  const users = await queryBuilder
    .sort()
    .filter()
    .paginate()
    .fieldSelect()
    .build()
    .select("-password");

  // Get meta data for pagination
  const meta = await queryBuilder.meta();

  return {
    data: users,
    meta,
  };
};

// Get single user
const getSingleUser = async (id: string) => {
  const user = await User.findById(id)
    .where({ isDeleted: { $ne: true } })
    .select("-password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

// Get profile info
const getProfileInfo = async (userId: string, userRole: string) => {
  switch (userRole) {
    case Role.ADMIN: {
      return await Admin.findOne({ userId }).populate({
        path: "userId",
        select: ["_id", "role", "status", "needChangePassword"],
      });
    }

    case Role.READER: {
      return await Reader.findOne({ userId }).populate({
        path: "userId",
        select: ["_id", "role", "status", "needChangePassword"],
      });
    }

    default:
      return null;
  }
};

// Update profile info
const updateProfileInfo = async (
  userId: string,
  userRole: string,
  payload: any
) => {
  switch (userRole) {
    case Role.ADMIN: {
      return await Admin.findOneAndUpdate({ userId }, payload, {
        new: true,
        runValidators: true,
      }).populate({
        path: "userId",
        select: ["_id", "role", "status", "needChangePassword"],
      });
    }

    case Role.READER: {
      return await Reader.findOneAndUpdate({ userId }, payload, {
        new: true,
        runValidators: true,
      }).populate({
        path: "userId",
        select: ["_id", "role", "status", "needChangePassword"],
      });
    }

    default:
      return null;
  }
};

// Delete user by userId
const deleteUser = async (id: string, userId: string) => {
  if (id === userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You cannot delete your own account currently"
    );
  }

  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      const user = await User.findById(id).session(session);
      if (!user || user.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
      }

      const deletedUser = await User.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true, session }
      ).select("-password");

      if (user.role === Role.ADMIN) {
        await Admin.findOneAndUpdate(
          { userId: id },
          { isDeleted: true },
          { session }
        );
      }

      if (user.role === Role.READER) {
        await Reader.findOneAndUpdate(
          { userId: id },
          { isDeleted: true },
          { session }
        );
      }

      return deletedUser;
    });
  } catch (error: any) {
    throw new AppError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to delete user"
    );
  } finally {
    await session.endSession();
  }
};

// User service object
const UserService = {
  getAllUsers,
  getSingleUser,
  getProfileInfo,
  updateProfileInfo,
  deleteUser,
};

export default UserService;
