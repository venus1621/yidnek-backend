import express from "express";
import {
  createOrGetConversation,
  createGroupConversation,
  getMyConversations,
  getConversationById,
  addParticipants,
  leaveConversation,
} from "../controllers/conversationController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Create or get 1-on-1 conversation
router.post("/", createOrGetConversation);

// Create group conversation
router.post("/group", createGroupConversation);

// Get all my conversations
router.get("/", getMyConversations);

// Get single conversation
router.get("/:conversationId", getConversationById);

// Add participants to group
router.post("/:conversationId/participants", addParticipants);

// Leave group conversation
router.delete("/:conversationId/leave", leaveConversation);

export default router;

