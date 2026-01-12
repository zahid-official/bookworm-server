import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import envVars from "./env";
import AppError from "../errors/AppError";
import httpStatus from "http-status-codes";
import stream from "stream";

// Configure cloudinary
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
  api_key: envVars.CLOUDINARY.API_KEY,
  api_secret: envVars.CLOUDINARY.API_SECRET,
});

// Upload buffer to cloudinary
export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  filename: string
): Promise<UploadApiResponse | undefined> => {
  try {
    return new Promise((resolve, reject) => {
      // Create a stream from the buffer
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);

      // Upload the stream to cloudinary
      cloudinary.uploader
        .upload_stream(
          {
            public_id: `pdf/${filename}-${Date.now()}`,
            resource_type: "auto",
            folder: "pdf",
          },

          (error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          }
        )
        .end(buffer);
    });
  } catch (error: any) {
    throw new AppError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to upload file to Cloudinary"
    );
  }
};

// Delete image from cloudinary
export const cloudinaryDelete = async (imageUrl: string) => {
  try {
    // Extract public_id from the image url
    const extractPublicId = /\/(?:v\d+\/)?([^/]+)\.(jpg|jpeg|png|gif|webp)$/i;
    const match = imageUrl.match(extractPublicId);

    // If public_id is found, delete the image from cloudinary
    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
    }
  } catch (error: any) {
    throw new AppError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to delete image from Cloudinary"
    );
  }
};

// Export the configured cloudinary instance
const cloudinaryUpload = cloudinary;
export default cloudinaryUpload;
