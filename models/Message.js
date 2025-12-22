import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },      // Cloudinary / S3
    originalName: String,                        // user_uploaded.pdf
    mimeType: String,                            // application/pdf
    size: Number,                                // bytes
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      trim: true,
    },

    messageType: {
      type: String,
      enum: ["TEXT", "FILE", "IMAGE", "MIXED"],
      default: "TEXT",
    },

    files: [fileSchema],

    readBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        readAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
