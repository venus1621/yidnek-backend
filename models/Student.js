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
    studentId: {
      type: String,
      require: true,
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
      fullName: { type: String, required: true, trim: true },
      relationship: String,
      phone: String,
    },
    guardianPhoto: String,
  },
  { timestamps: true }
);
studentSchema.pre("save", async function (next) {
  if (this.studentCode) return next();

  const counter = await Counter.findOneAndUpdate(
    { name: "studentCode" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.studentCode = counter.seq.toString().padStart(4, "0");

  next();
});
export default mongoose.model("Student", studentSchema);
