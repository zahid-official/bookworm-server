import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import { verifyJWT } from "../utils/JWT";
import envVars from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import User from "../modules/user/user.model";
import { AccountStatus } from "../modules/user/user.interface";

// Token validation & role-based access control middleware
const validateToken = (...userRoles: string[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    // Check if access token is provided
    if (!accessToken) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "No access token provided, authorization denied"
      );
    }

    // Verify & decode access token
    const verifiedAccessToken = verifyJWT(
      accessToken,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;

    // Check if user exists
    const user = await User.findOne({ email: verifiedAccessToken.email });
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User does not exist");
    }

    // Check if user is inactive, blocked or suspended
    if (
      user.status === AccountStatus.BLOCKED ||
      user.status === AccountStatus.INACTIVE 
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        `User is ${user.status}. Please contact support for more information.`
      );
    }

    // Check if user is deleted
    if (user.isDeleted) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "User is deleted. Please contact support for more information."
      );
    }

    // Check if user has permission to access
    if (!userRoles.includes(verifiedAccessToken.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have permission to access this resource"
      );
    }

    // Attach the decoded token to the request object for further use
    req.decodedToken = verifiedAccessToken;
    next();
  });

export default validateToken;
