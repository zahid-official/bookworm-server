import { Types } from "mongoose";

// Admin interface definition
export interface IAdmin {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profilePhoto?: string;
  isDeleted: boolean;
  userId: Types.ObjectId; // reference to User._id
  createdAt?: Date;
}
