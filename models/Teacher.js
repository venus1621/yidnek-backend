// models/Teacher.js
import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    sundaySchoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SundaySchool",
      required: true,
      index: true,
    },

    fullName: {
      first: {
        type: String,
        required: true,
        trim: true,
      },
      father: {
        type: String,
        required: true,
        trim: true,
      },
      grandfather: {
        type: String,
        trim: true,
      },
    },

    contact: {
      phone: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE",
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate teacher under same SundaySchool
teacherSchema.index(
  {
    sundaySchoolId: 1,
    "fullName.first": 1,
    "fullName.father": 1,
  },
  { unique: true }
);

export default mongoose.model("Teacher", teacherSchema);
