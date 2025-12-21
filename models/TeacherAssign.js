
import mongoose from "mongoose";
const teacherAssignSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    course: String,
    maxScore: Number,
  },
  { timestamps: true }
);
export default mongoose.model("TeacherAssign", teacherAssignSchema);