import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import https from "https";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

/**
 * Fix filename encoding for non-ASCII characters (Amharic, Arabic, etc.)
 * Browsers may send filenames in Latin-1 encoding
 */
const fixFilenameEncoding = (filename) => {
  if (!filename) return filename;
  
  try {
    // Check if filename contains mojibake (corrupted UTF-8)
    // Try to decode from Latin-1 to UTF-8
    const buffer = Buffer.from(filename, "latin1");
    const decoded = buffer.toString("utf8");
    
    // If decoded version has valid Unicode characters, use it
    // Check if original looks corrupted (has replacement chars or weird sequences)
    if (decoded && !decoded.includes("�") && decoded !== filename) {
      return decoded;
    }
    
    return filename;
  } catch (e) {
    return filename;
  }
};

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

        // 🔑 Generate force-download URL
        const downloadUrl = uploadResult.secure_url.replace(
          "/upload/",
          "/upload/fl_attachment/"
        );

        // Fix filename encoding for non-ASCII characters
        const originalName = fixFilenameEncoding(file.originalname);

        uploadedFiles.push({
          url: uploadResult.secure_url, // preview / open
          downloadUrl, // force download
          originalName: originalName,
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

    // Populate sender info for real-time emission
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "username");

    const io = req.app.get("io");

    // 1️⃣ Send message to conversation room
    io.to(`conversation:${conversationId}`).emit("newMessage", populatedMessage);

    // 2️⃣ Notify participants (except sender)
    conversation.participants.forEach((participantId) => {
      if (participantId.toString() !== senderId) {
        io.to(`user:${participantId}`).emit("notification", {
          type: "NEW_MESSAGE",
          conversationId,
          messageId: message._id,
          from: senderId,
          senderName: req.user.username,
          preview: content?.slice(0, 50) || "📎 New attachment",
          createdAt: message.createdAt,
        });
      }
    });

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId, fileIndex } = req.params;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    // optional: ensure user is a participant in the conversation
    const isParticipant = message.conversationId && message.conversationId;

    const index = parseInt(fileIndex, 10);
    if (Number.isNaN(index) || index < 0 || index >= (message.files || []).length) {
      return res.status(400).json({ error: "Invalid file index" });
    }

    const file = message.files[index];
    if (!file || !file.url) return res.status(404).json({ error: "File not found" });

    // Stream the file from Cloudinary and force the download filename
    const originalName = file.originalName || "download";

    // Set response headers for attachment with UTF-8 filename
    res.setHeader("Content-Type", file.mimeType || "application/octet-stream");
    // Use RFC5987 encoding for Unicode filenames
    res.setHeader(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${encodeURIComponent(originalName)}`
    );

    const fileUrl = file.url;
    const parsedUrl = new URL(fileUrl);

    // GET the file from Cloudinary and pipe to client
    https
      .get(parsedUrl, (cloudRes) => {
        // Follow redirect if any
        if (cloudRes.statusCode >= 300 && cloudRes.statusCode < 400 && cloudRes.headers.location) {
          https.get(cloudRes.headers.location, (r2) => {
            r2.pipe(res);
          }).on("error", (err) => {
            console.error("follow redirect error:", err);
            res.status(500).end();
          });
          return;
        }

        if (cloudRes.statusCode !== 200) {
          res.status(cloudRes.statusCode).end();
          return;
        }

        cloudRes.pipe(res);
      })
      .on("error", (err) => {
        console.error("download proxy error:", err);
        res.status(500).json({ error: err.message });
      });
  } catch (err) {
    console.error("downloadFile error:", err);
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