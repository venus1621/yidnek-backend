
import mongoose from "mongoose";
const churchSchema = new mongoose.Schema({
  name: { type: String, default: "Ethiopian Orthodox Tewahedo Church" },
  country: { type: String, default: "Ethiopia" }
},{timestamps:true});
export default mongoose.model("Church", churchSchema);
