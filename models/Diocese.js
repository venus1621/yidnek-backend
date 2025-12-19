
import mongoose from "mongoose";
const dioceseSchema = new mongoose.Schema({
  churchId:{ type: mongoose.Schema.Types.ObjectId, ref:"Church", required:true },
  name:{ type:String, required:true }
},{timestamps:true});
export default mongoose.model("Diocese", dioceseSchema);
