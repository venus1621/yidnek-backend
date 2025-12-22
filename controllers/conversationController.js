import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

/**
 * Create or get existing 1-on-1 conversation
 */
export const createOrGetConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({ error: "participantId is required" });
    }

    if (participantId === userId) {
      return res.status(400).json({ error: "Cannot create conversation with yourself" });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [userId, participantId], $size: 2 },
    }).populate("participants", "username")
      .populate("lastMessage");

    if (conversation) {
      return res.json({ success: true, data: conversation, existing: true });
    }

    // Create new conversation
    conversation = await Conversation.create({
      participants: [userId, participantId],
      isGroup: false,
    });

    conversation = await Conversation.findById(conversation._id)
      .populate("participants", "username");

    // Notify the other participant via socket
    const io = req.app.get("io");
    io.to(`user:${participantId}`).emit("newConversation", conversation);

    res.status(201).json({ success: true, data: conversation, existing: false });
  } catch (err) {
    console.error("createOrGetConversation error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Create a group conversation
 */
export const createGroupConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { participantIds, groupName, sundaySchoolId } = req.body;

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length < 1) {
      return res.status(400).json({ error: "At least one participant is required" });
    }

    if (!groupName) {
      return res.status(400).json({ error: "groupName is required for group chats" });
    }

    // Include creator in participants
    const allParticipants = [...new Set([userId, ...participantIds])];

    const conversation = await Conversation.create({
      participants: allParticipants,
      isGroup: true,
      groupName,
      sundaySchoolId: sundaySchoolId || null,
    });

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate("participants", "username");

    // Notify all participants
    const io = req.app.get("io");
    allParticipants.forEach((pId) => {
      if (pId !== userId) {
        io.to(`user:${pId}`).emit("newConversation", populatedConversation);
      }
    });

    res.status(201).json({ success: true, data: populatedConversation });
  } catch (err) {
    console.error("createGroupConversation error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all conversations for the current user
 */
export const getMyConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "username")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "username" },
      })
      .sort({ updatedAt: -1 });

    // Add unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          "readBy.user": { $ne: userId },
        });
        return {
          ...conv.toObject(),
          unreadCount,
        };
      })
    );

    res.json({ success: true, data: conversationsWithUnread });
  } catch (err) {
    console.error("getMyConversations error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get single conversation by ID
 */
export const getConversationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    })
      .populate("participants", "username")
      .populate("lastMessage");

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json({ success: true, data: conversation });
  } catch (err) {
    console.error("getConversationById error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Add participants to group conversation
 */
export const addParticipants = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { participantIds } = req.body;

    if (!participantIds || !Array.isArray(participantIds)) {
      return res.status(400).json({ error: "participantIds array is required" });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (!conversation.isGroup) {
      return res.status(400).json({ error: "Cannot add participants to 1-on-1 conversation" });
    }

    // Add new participants
    const newParticipants = participantIds.filter(
      (id) => !conversation.participants.includes(id)
    );

    conversation.participants.push(...newParticipants);
    await conversation.save();

    const updated = await Conversation.findById(conversationId)
      .populate("participants", "username");

    // Notify new participants
    const io = req.app.get("io");
    newParticipants.forEach((pId) => {
      io.to(`user:${pId}`).emit("addedToConversation", updated);
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("addParticipants error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Leave a group conversation
 */
export const leaveConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (!conversation.isGroup) {
      return res.status(400).json({ error: "Cannot leave 1-on-1 conversation" });
    }

    conversation.participants = conversation.participants.filter(
      (p) => p.toString() !== userId
    );

    await conversation.save();

    // Notify remaining participants
    const io = req.app.get("io");
    io.to(`conversation:${conversationId}`).emit("participantLeft", {
      conversationId,
      userId,
    });

    res.json({ success: true, message: "Left conversation" });
  } catch (err) {
    console.error("leaveConversation error:", err);
    res.status(500).json({ error: err.message });
  }
};

