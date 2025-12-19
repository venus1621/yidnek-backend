
import mongoose from "mongoose";
const guardianSchema = new mongoose.Schema({
  sundaySchoolId:{ type: mongoose.Schema.Types.ObjectId, ref:"SundaySchool" },
  fullName:String,
  phone:String
},{timestamps:true});
export default mongoose.model("Guardian", guardianSchema);
