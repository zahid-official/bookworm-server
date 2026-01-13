import mongoose from "mongoose";
import envVars from "../../config/env";
import AppError from "../../errors/AppError";
import { bcryptjs, httpStatus } from "../../import";
import User from "../user/user.model";
import { IReader } from "./reader.interface";
import Reader from "./reader.model";

// Create reader
const createReader = async (payload: IReader, password: string) => {
  // Block duplicate accounts by email
  const existingUser = await User.findOne({ email: payload?.email });
  if (existingUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      `An account already exists for '${payload?.email}'. Sign in or use a different email.`
    );
  }

  if (!payload.profilePhoto) {
    throw new AppError(httpStatus.BAD_REQUEST, "Profile photo is required");
  }

  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      // Hash password
      const hashedPassword = await bcryptjs.hash(
        password,
        envVars.BCRYPT_SALT_ROUNDS
      );

      // Create user
      const [user] = await User.create(
        [
          {
            email: payload.email,
            password: hashedPassword,
            needChangePassword: false,
          },
        ],
        { session }
      );

      // Create reader linked to user
      const [reader] = await Reader.create([{ ...payload, userId: user._id }], {
        session,
      });

      return reader;
    });
  } catch (error: any) {
    throw new AppError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to create account"
    );
  } finally {
    await session.endSession();
  }
};

// Reader service object
const ReaderService = {
  createReader,
};

export default ReaderService;
