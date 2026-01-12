import envVars from "../../config/env";
import AppError from "../../errors/AppError";
import { bcryptjs, httpStatus } from "../../import";
import User from "../user/user.model";

// Change password
const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  // Check if user exists and not deleted
  const user = await User.findById(userId);
  if (!user || user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Validate old password
  const isMatch = await bcryptjs.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password is incorrect");
  }

  // Prevent reusing the same password
  if (oldPassword === newPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password cannot be the same as old password"
    );
  }

  // Hash new password
  const hashedPassword = await bcryptjs.hash(
    newPassword,
    envVars.BCRYPT_SALT_ROUNDS
  );

  // Update user password and flag
  user.password = hashedPassword;
  user.needChangePassword = false;
  await user.save();

  // Remove password before returning user data
  const { password, ...sanitizedUser } = user.toObject();
  void password;
  return sanitizedUser;
};

// Auth service object
const AuthService = {
  changePassword,
};

export default AuthService;
