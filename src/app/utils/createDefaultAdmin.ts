/* eslint-disable no-console */

import mongoose from "mongoose";
import envVars from "../config/env";
import { bcryptjs } from "../import";
import Admin from "../modules/admin/admin.model";
import { Role } from "../modules/user/user.interface";
import User from "../modules/user/user.model";

const createDefaultAdmin = async () => {
  try {
    // Check if default admin exists by email
    const isAdminExists = await User.findOne({
      email: envVars.DEFAULT_ADMIN_EMAIL,
    });

    if (isAdminExists) {
      return;
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      // Hash password
      const hashedPassword = await bcryptjs.hash(
        envVars.DEFAULT_ADMIN_PASSWORD,
        envVars.BCRYPT_SALT_ROUNDS
      );

      // Create user
      const [user] = await User.create(
        [
          {
            email: envVars.DEFAULT_ADMIN_EMAIL,
            password: hashedPassword,
            role: Role.ADMIN,
          },
        ],
        { session }
      );

      // Create Admin (linked to user)
      await Admin.create(
        [
          {
            name: "Default Admin",
            email: envVars.DEFAULT_ADMIN_EMAIL,
            userId: user._id,
          },
        ],
        { session }
      );

      console.log("✅ Default admin created successfully");
    });

    await session.endSession();
  } catch (error) {
    console.error("Failed to create default admin:", error);
  }
};

export default createDefaultAdmin;
