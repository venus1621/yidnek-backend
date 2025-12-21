import express from "express";
import {
  getAllAssessments,
  getAssessmentById,
  getAssessmentsByClass,
  getAssessmentsByTeacher,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} from "../controllers/assessmentController.js";

const router = express.Router();

router.get("/", getAllAssessments);
router.get("/class/:classId", getAssessmentsByClass);
router.get("/teacher/:teacherId", getAssessmentsByTeacher);
router.get("/:id", getAssessmentById);
router.post("/", createAssessment);
router.put("/:id", updateAssessment);
router.delete("/:id", deleteAssessment);

export default router;

