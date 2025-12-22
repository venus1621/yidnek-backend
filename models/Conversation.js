import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Optional: restrict chat to same SundaySchool
    sundaySchoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SundaySchool",
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    isGroup: {
      type: Boolean,
      default: false,
    },

    groupName: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
