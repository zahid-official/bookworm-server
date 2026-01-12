import { Types } from "mongoose";

// Reader interface definition
export interface IReader {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profilePhoto?: string;
  isDeleted: boolean;
  userId: Types.ObjectId; // reference to User._id
  createdAt?: Date;
}
