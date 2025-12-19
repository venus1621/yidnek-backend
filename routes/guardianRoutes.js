import express from "express";
import {
  getAllGuardians,
  getGuardianById,
  getGuardiansBySundaySchool,
  createGuardian,
  updateGuardian,
  deleteGuardian,
} from "../controllers/guardianController.js";

const router = express.Router();

router.get("/", getAllGuardians);
router.get("/sunday-school/:sundaySchoolId", getGuardiansBySundaySchool);
router.get("/:id", getGuardianById);
router.post("/", createGuardian);
router.put("/:id", updateGuardian);
router.delete("/:id", deleteGuardian);

export default router;

