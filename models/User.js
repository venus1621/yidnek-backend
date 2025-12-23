
import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    fullName: String,
    username: String,
    passwordHash: String,
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    sundaySchoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SundaySchool",
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
