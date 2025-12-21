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

// More specific route first
router.get("/sunday-school/:sundaySchoolId", getStudentBySundayschool);

// General routes
router.get("/", getAllStudents);
router.get("/:id", getStudentById);

// Create & update with optional photo upload
router.post("/", createStudent);
router.put("/:id", uploadStudentPhoto, updateStudent);

// Delete student
router.delete("/:id", deleteStudent);

export default router;
