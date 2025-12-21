import express from "express";
import {
  getAllTeacherAssigns,
  getTeacherAssignById,
  getTeacherAssignsByClass,
  getTeacherAssignsByTeacher,
  createTeacherAssign,
  updateTeacherAssign,
  deleteTeacherAssign,
} from "../controllers/teacherAssignController.js";

const router = express.Router();

// Get all teacher assignments
router.get("/", getAllTeacherAssigns);

// Get teacher assignments by class
router.get("/class/:classId", getTeacherAssignsByClass);

// Get teacher assignments by teacher
router.get("/teacher/:teacherId", getTeacherAssignsByTeacher);

// Get single teacher assignment
router.get("/:id", getTeacherAssignById);

// Create teacher assignment
router.post("/", createTeacherAssign);

// Update teacher assignment
router.put("/:id", updateTeacherAssign);

// Delete teacher assignment
router.delete("/:id", deleteTeacherAssign);

export default router;
