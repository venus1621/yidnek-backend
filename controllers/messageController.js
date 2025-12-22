import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

/**
 * SEND MESSAGE (TEXT / FILE / IMAGE)
 */
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { conversationId, content } = req.body;

    if (!conversationId) {
      return res.status(400).json({ error: "conversationId required" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Upload files (if any)
    let uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await uploadToCloudinary(
          file.buffer,
          file.mimetype,
          "messages"
        );

        uploadedFiles.push({
          url: uploadResult.secure_url,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
        });
      }
    }

    const messageType =
      uploadedFiles.length > 0 && content
        ? "MIXED"
        : uploadedFiles.length > 0
        ? "FILE"
        : "TEXT";

    const message = await Message.create({
      conversationId,
      sender: senderId,
      content,
      messageType,
      files: uploadedFiles,
      readBy: [{ user: senderId }],
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    const io = req.app.get("io");

    // 1️⃣ Send message to conversation room
    io.to(`conversation:${conversationId}`).emit("newMessage", message);

    // 2️⃣ Notify participants (except sender)
    conversation.participants.forEach((userId) => {
      if (userId.toString() !== senderId) {
        io.to(`user:${userId}`).emit("notification", {
          type: "NEW_MESSAGE",
          conversationId,
          messageId: message._id,
          from: senderId,
          preview: content?.slice(0, 50) || "📎 New attachment",
          createdAt: message.createdAt,
        });
      }
    });

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .populate("sender", "username")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({ error: "conversationId is required" });
    }

    // Update unread messages only
    await Message.updateMany(
      {
        conversationId,
        "readBy.user": { $ne: userId },
      },
      {
        $push: {
          readBy: {
            user: userId,
            readAt: new Date(),
          },
        },
      }
    );

    // Emit read receipt (optional but recommended)
    const io = req.app.get("io");
    io.to(`conversation:${conversationId}`).emit("messagesRead", {
      conversationId,
      userId,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("markAsRead error:", err);
    res.status(500).json({ error: err.message });
  }
};