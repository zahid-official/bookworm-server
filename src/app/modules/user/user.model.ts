import { Schema, model } from "mongoose";
import { AccountStatus, IUser, Role } from "./user.interface";

// Mongoose schema for user model
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.READER },
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },
    isDeleted: { type: Boolean, default: false },
    needChangePassword: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("admin", {
  ref: "Admin",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

userSchema.virtual("reader", {
  ref: "Reader",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

// Create mongoose model from user schema
const User = model<IUser>("User", userSchema);
export default User;
