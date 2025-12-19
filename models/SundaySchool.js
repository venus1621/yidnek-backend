
import mongoose from "mongoose";
const sundaySchoolSchema = new mongoose.Schema({
  woredaId:{ type: mongoose.Schema.Types.ObjectId, ref:"Woreda", required:true },
  name:{ type:String, required:true }
},{timestamps:true});
export default mongoose.model("SundaySchool", sundaySchoolSchema);
