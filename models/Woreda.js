
import mongoose from "mongoose";
const woredaSchema = new mongoose.Schema({
  dioceseId:{ type: mongoose.Schema.Types.ObjectId, ref:"Diocese", required:true },
  name:{ type:String, required:true }
},{timestamps:true});
export default mongoose.model("Woreda", woredaSchema);
