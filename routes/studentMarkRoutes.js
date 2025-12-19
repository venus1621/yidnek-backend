import express from "express";
import {
  getAllStudentMarks,
  getStudentMarkById,
  getMarksByAssessment,
  getMarksByStudent,
  createStudentMark,
  updateStudentMark,
  deleteStudentMark,
} from "../controllers/studentMarkController.js";

const router = express.Router();

router.get("/", getAllStudentMarks);
router.get("/assessment/:assessmentId", getMarksByAssessment);
router.get("/student/:studentId", getMarksByStudent);
router.get("/:id", getStudentMarkById);
router.post("/", createStudentMark);
router.put("/:id", updateStudentMark);
router.delete("/:id", deleteStudentMark);

export default router;

