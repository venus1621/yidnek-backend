import express from "express";
import {
  getAllClasses,
  getClassById,
  getClassesBySundaySchool,
  createClass,
  updateClass,
  deleteClass,
} from "../controllers/classController.js";

const router = express.Router();

router.get("/", getAllClasses);
router.get("/sunday-school/:sundaySchoolId", getClassesBySundaySchool);
router.get("/:id", getClassById);
router.post("/", createClass);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);

export default router;

