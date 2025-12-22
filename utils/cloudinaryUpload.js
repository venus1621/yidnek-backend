import cloudinary from "../config/cloudinary.js";

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
