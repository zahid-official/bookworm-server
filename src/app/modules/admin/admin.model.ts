import { model, Schema } from "mongoose";
import { IAdmin } from "./admin.interface";

// Mongoose schema for admin model
const adminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    profilePhoto: { type: String },
    isDeleted: { type: Boolean, default: false },

    // relation to User via ObjectId
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { versionKey: false, timestamps: true }
);

// Create mongoose model from user schema
const Admin = model<IAdmin>("Admin", adminSchema);
export default Admin;
