
import mongoose from "mongoose";
const teacherAssignmentSchema = new mongoose.Schema({
  teacherId:{ type: mongoose.Schema.Types.ObjectId, ref:"Teacher" },
  classId:{ type: mongoose.Schema.Types.ObjectId, ref:"Class" }
},{timestamps:true});
export default mongoose.model("TeacherAssignment", teacherAssignmentSchema);
