import { Schema, model } from "mongoose";
import { ITutorial } from "./tutorial.interface";

// Mongoose schema for tutorial model
const tutorialSchema = new Schema<ITutorial>(
  {
    title: { type: String, required: true, trim: true },
    youtubeUrl: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Create mongoose model from tutorial schema
const Tutorial = model<ITutorial>("Tutorial", tutorialSchema);
export default Tutorial;
