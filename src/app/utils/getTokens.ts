import envVars from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateJWT } from "./JWT";

// Generate access and refresh tokens
const getTokens = (user: Partial<IUser>) => {
  // Payload
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  // Generate JWT access token
  const accessToken = generateJWT(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRESIN
  );

  // Generate JWT refresh token
  const refreshToken = generateJWT(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRESIN
  );

  return { accessToken, refreshToken };
};

// Recreate access token only
export const recreateToken = (user: Partial<IUser>) => {
  // Payload
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  // Generate JWT access token
  const accessToken = generateJWT(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRESIN
  );

  return accessToken;
};

// Generate reset token
export const generateResetToken = (user: Partial<IUser>) => {
  // Payload
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  // Generate JWT reset token
  const resetToken = generateJWT(jwtPayload, envVars.JWT_ACCESS_SECRET, "10m");
  return resetToken;
};

export default getTokens;
