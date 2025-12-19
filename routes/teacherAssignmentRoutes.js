import express from "express";
import {
  getAllTeacherAssignments,
  getTeacherAssignmentById,
  getAssignmentsByTeacher,
  getAssignmentsByClass,
  createTeacherAssignment,
  updateTeacherAssignment,
  deleteTeacherAssignment,
} from "../controllers/teacherAssignmentController.js";

const router = express.Router();

router.get("/", getAllTeacherAssignments);
router.get("/teacher/:teacherId", getAssignmentsByTeacher);
router.get("/class/:classId", getAssignmentsByClass);
router.get("/:id", getTeacherAssignmentById);
router.post("/", createTeacherAssignment);
router.put("/:id", updateTeacherAssignment);
router.delete("/:id", deleteTeacherAssignment);

export default router;

