import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary configuration
 * ⚠️ In production, move secrets to .env
 */
cloudinary.config({
  cloud_name: "dnkei7qmd",
  api_key: "253842746644724",
  api_secret: "m8MrfvHdbIgUUlk9VqGRSLFo-4g",
});

/**
 * Upload file buffer to Cloudinary
 */
export const uploadToCloudinary = async (buffer, mimetype, folder = "messages") => {
  return cloudinary.uploader.upload(
    `data:${mimetype};base64,${buffer.toString("base64")}`,
    {
      folder,
      resource_type: "auto", // supports images, pdf, video, etc.
    }
  );
};
