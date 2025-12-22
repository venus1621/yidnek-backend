import express from "express";
import {
  sendMessage,
  getMessagesByConversation,
  markAsRead,
} from "../controllers/messageController.js";
import { uploadMessageFiles } from "../middlewares/upload.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

// All message routes require authentication
router.use(requireAuth);

router.post("/", uploadMessageFiles, sendMessage);
router.get("/:conversationId", getMessagesByConversation);
router.put("/:conversationId/read", markAsRead);

export default router;
