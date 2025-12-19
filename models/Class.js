
import mongoose from "mongoose";
const classSchema = new mongoose.Schema({
  sundaySchoolId:{ type: mongoose.Schema.Types.ObjectId, ref:"SundaySchool", required:true },
  grade:Number,
  section:String,
  academicYear:{ ethiopianYear:Number }
},{timestamps:true});
export default mongoose.model("Class", classSchema);
