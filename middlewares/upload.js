import multer from "multer";

const storage = multer.memoryStorage();

export const uploadMessageFiles = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
}).array("files", 5); // max 5 files
