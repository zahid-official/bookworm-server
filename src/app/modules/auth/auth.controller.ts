import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import { clearCookies, setCookies } from "../../utils/cookies";
import sendResponse from "../../utils/sendResponse";
import passport from "passport";
import getTokens from "../../utils/getTokens";
import AuthService from "./auth.service";

// Credentials login
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (error: any, user: any, info: any) => {
      if (error) {
        return next(new AppError(httpStatus.UNAUTHORIZED, info.message));
      }

      if (!user) {
        return next(new AppError(httpStatus.UNAUTHORIZED, info.message));
      }

      // Generate tokens & set in cookies
      const tokens = getTokens(user);
      setCookies(res, tokens);

      // Convert to plain object & remove password before sending response
      const result = user.toObject();
      delete result?.password;

      // Send response
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Credentials login successful",
        data: result,
      });
    })(req, res, next);
  }
);

// Logout user
const logout = catchAsync(async (req: Request, res: Response) => {
  // Clear cookies
  clearCookies(res);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged out successfully",
    data: null,
  });
});

// Change password
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.decodedToken?.userId;
  const { oldPassword, newPassword } = req?.body || {};

  const result = await AuthService.changePassword(
    userId,
    oldPassword,
    newPassword
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: result,
  });
});

// Auth controller object
const AuthController = {
  credentialsLogin,
  logout,
  changePassword,
};

export default AuthController;
