// models/Student.js
import mongoose from "mongoose";

/* Counter (inside same file) */
const counterSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("StudentCounter", counterSchema);

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    grandfatherName: { type: String, required: true, trim: true },

    // Auto-generated student code
    studentCode: {
      type: String,
      unique: true,
      trim: true,
    },

    sundaySchoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SundaySchool",
      required: true,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
    },

    dateOfBirth: {
      day: Number,
      month: Number,
      year: Number,
    },

    christianName: { type: String, trim: true },
    confessionFatherName: { type: String, trim: true },

    studentPhone: { type: String, trim: true },
    studentPhoto: {
      type: String,
      trim: true,
    },
    address: {
      subCity: String,
      woreda: String,
      houseNumber: String,
    },

    guardian: {
      fullName: { type: String, trim: true },
      relationship: String,
      phone: String,
    },
    guardianPhoto: String,
  },
  { timestamps: true }
);

/* 🔹 AUTO-INCREMENT studentCode */
studentSchema.pre("save", async function (next) {
  if (this.studentCode) return next(); // Already exists, skip

  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "studentCode" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.studentCode = counter.seq.toString().padStart(4, "0");

    next();
  } catch (err) {
    next(err); // Proper error handling
  }
});

export default mongoose.model("Student", studentSchema);
