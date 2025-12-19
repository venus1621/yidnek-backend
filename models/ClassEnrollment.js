
import mongoose from "mongoose";
const classEnrollmentSchema = new mongoose.Schema({
  studentId:{ type: mongoose.Schema.Types.ObjectId, ref:"Student" },
  classId:{ type: mongoose.Schema.Types.ObjectId, ref:"Class" }
},{timestamps:true});
export default mongoose.model("ClassEnrollment", classEnrollmentSchema);
