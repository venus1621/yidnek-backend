
import mongoose from "mongoose";
const registrationSchema = new mongoose.Schema({
  studentId:{ type: mongoose.Schema.Types.ObjectId, ref:"Student" },
  guardianId:{ type: mongoose.Schema.Types.ObjectId, ref:"Guardian" },
  classLevel:Number
},{timestamps:true});
export default mongoose.model("Registration", registrationSchema);
