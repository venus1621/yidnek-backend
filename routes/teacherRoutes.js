import express from "express";
import {
  getAllTeachers,
  getTeacherById,
  getTeachersBySundaySchool,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

const router = express.Router();

router.get("/", getAllTeachers);
router.get("/sunday-school/:sundaySchoolId", getTeachersBySundaySchool);
router.get("/:id", getTeacherById);
router.post("/", createTeacher);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);

export default router;

