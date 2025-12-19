
import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: String,
    passwordHash: String,
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    sundaySchoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SundaySchool",
    },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
