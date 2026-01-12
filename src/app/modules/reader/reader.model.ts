import { model, Schema } from "mongoose";
import { IReader } from "./reader.interface";

// Mongoose schema for reader model
const readerSchema = new Schema<IReader>(
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

// Create mongoose model from Reader schema
const Reader = model<IReader>("Reader", readerSchema);
export default Reader;
