
import mongoose from "mongoose";
const classSchema = new mongoose.Schema(
  {
    sundaySchoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SundaySchool",
      required: true,
    },
    grade: Number,
    section: String,
    academicYear: { ethiopianYear: Number },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  },
  { timestamps: true }
);
export default mongoose.model("Class", classSchema);
