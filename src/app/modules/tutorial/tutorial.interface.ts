import { Types } from "mongoose";

// Tutorial interface definition
export interface ITutorial {
  _id?: Types.ObjectId;
  title: string;
  youtubeUrl: string;
  description?: string;
  createdAt?: Date;
}
