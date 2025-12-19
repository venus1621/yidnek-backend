// models/Student.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    grandfatherName: { type: String, required: true, trim: true },

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

    address: {
      subCity: String,
      woreda: String,
      houseNumber: String,
    },

    guardian: {
      fullName: { type: String, required: true, trim: true },
      relationship: String,
      phone: String,
    },

    studentPhoto: String,
    guardianPhoto: String,
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
