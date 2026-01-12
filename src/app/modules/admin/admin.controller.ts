import { Request, Response } from "express";
import { httpStatus } from "../../import";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AdminService from "./admin.service";

// Create admin
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { password, ...body } = req?.body || {};
  const result = await AdminService.createAdmin(body, password);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Admin created successfully",
    data: result,
  });
});

// Admin controller object
const AdminController = {
  createAdmin,
};

export default AdminController;
