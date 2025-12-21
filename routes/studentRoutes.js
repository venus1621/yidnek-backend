import express from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentBySundayschool,
  uploadStudentPhoto,
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/", uploadStudentPhoto, createStudent);
router.put("/:id", uploadStudentPhoto, updateStudent);
router.delete("/:id", deleteStudent);
router.get("/sunday-school/:sundaySchoolId", getStudentBySundayschool);

export default router;

