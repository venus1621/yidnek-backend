import cloudinary from "../config/cloudinary.js";

/**
 * Upload file buffer to Cloudinary
 * - Images → image
 * - Documents (PDF, DOC, XLS, ZIP) → raw (REQUIRED for download)
 * - Video / Audio → video
 */
export const uploadToCloudinary = async (
  buffer,
  mimetype,
  folder = "messages"
) => {
  let resourceType = "image";

  // Documents → RAW (critical for download)
  if (
    mimetype === "application/pdf" ||
    mimetype === "application/msword" ||
    mimetype.includes("officedocument") ||
    mimetype === "application/zip" ||
    mimetype === "application/x-zip-compressed" ||
    mimetype === "text/plain"
  ) {
    resourceType = "raw";
  }

  // Video / Audio
  if (mimetype.startsWith("video/") || mimetype.startsWith("audio/")) {
    resourceType = "video";
  }

  return cloudinary.uploader.upload(
    `data:${mimetype};base64,${buffer.toString("base64")}`,
    {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    }
  );
};
