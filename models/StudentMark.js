
import mongoose from "mongoose";
const studentMarkSchema = new mongoose.Schema(
  {
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assessment" },
    title: String,
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    score: Number,
  },
  { timestamps: true }
);
export default mongoose.model("StudentMark", studentMarkSchema);
