import express from "express";
import {
  getAllClassEnrollments,
  getClassEnrollmentById,
  getEnrollmentsByStudent,
  getEnrollmentsByClass,
  createClassEnrollment,
  updateClassEnrollment,
  deleteClassEnrollment,
} from "../controllers/classEnrollmentController.js";

const router = express.Router();

router.get("/", getAllClassEnrollments);
router.get("/student/:studentId", getEnrollmentsByStudent);
router.get("/class/:classId", getEnrollmentsByClass);
router.get("/:id", getClassEnrollmentById);
router.post("/", createClassEnrollment);
router.put("/:id", updateClassEnrollment);
router.delete("/:id", deleteClassEnrollment);

export default router;

