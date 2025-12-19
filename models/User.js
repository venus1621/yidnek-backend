
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username:String,
  passwordHash:String,
  roles:[{ type: mongoose.Schema.Types.ObjectId, ref:"Role" }]
},{timestamps:true});
export default mongoose.model("User", userSchema);
