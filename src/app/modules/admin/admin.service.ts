import mongoose from "mongoose";
import envVars from "../../config/env";
import AppError from "../../errors/AppError";
import { bcryptjs, httpStatus } from "../../import";
import { Role } from "../user/user.interface";
import User from "../user/user.model";
import { IAdmin } from "./admin.interface";
import Admin from "./admin.model";

// Create admin
const createAdmin = async (payload: IAdmin, password: string) => {
  // Block duplicate accounts by email
  const existingUser = await User.findOne({ email: payload?.email });
  if (existingUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      `An account already exists for '${payload?.email}'. Sign in or use a different email.`
    );
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
        [{ email: payload.email, password: hashedPassword, role: Role.ADMIN }],
        { session }
      );

      // Create admin linked to user
      const [admin] = await Admin.create([{ ...payload, userId: user._id }], {
        session,
      });

      return admin;
    });
  } catch (error: any) {
    throw new AppError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to create admin"
    );
  } finally {
    await session.endSession();
  }
};

// Admin service object
const AdminService = {
  createAdmin,
};

export default AdminService;
