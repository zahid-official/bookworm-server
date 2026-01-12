import { Types } from "mongoose";

// Defines user roles
export enum Role {
  ADMIN = "ADMIN",
  READER = "READER"
}

// Defines account status
export enum AccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

// User interface definition
export interface IUser {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  role: Role;
  status: AccountStatus;
  isDeleted: boolean;
  needChangePassword: boolean;
  createdAt?: Date;
}
