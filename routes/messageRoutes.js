import express from "express";
import {
  sendMessage,
  getMessagesByConversation,
  markAsRead,
} from "../controllers/messageController.js";
import { uploadMessageFiles } from "../middlewares/upload.js";

const router = express.Router();

router.post("/", uploadMessageFiles, sendMessage);
router.get("/:conversationId", getMessagesByConversation);
router.put("/:conversationId/read",  markAsRead);

export default router;
