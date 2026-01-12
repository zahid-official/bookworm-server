import { Request, Response } from "express";
import { httpStatus } from "../../import";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import UserService from "./user.service";

// Get all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req?.query;
  const result = await UserService.getAllUsers(query as Record<string, string>);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// Get single user
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id as string;
  const result = await UserService.getSingleUser(id);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

// Get profile info
const getProfileInfo = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.decodedToken?.userId;
  const userRole = req?.decodedToken?.role;
  const result = await UserService.getProfileInfo(userId, userRole);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile info retrieved successfully",
    data: result,
  });
});

// Upate profile info
const updateProfileInfo = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.decodedToken?.userId;
  const userRole = req?.decodedToken?.role;
  const payload = req.body;
  if (req.file?.path) {
    payload.profilePhoto = req.file.path;
  }
  const result = await UserService.updateProfileInfo(userId, userRole, payload);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile info updated successfully",
    data: result,
  });
});

// Delete user by userId
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id as string;
  const userId = req?.decodedToken?.userId;
  const result = await UserService.deleteUser(id, userId);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successfully",
    data: result,
  });
});

// User controller object
const UserController = {
  getAllUsers,
  getSingleUser,
  getProfileInfo,
  updateProfileInfo,
  deleteUser,
};

export default UserController;
