import express from "express";
import {
  getAllRegistrations,
  getRegistrationById,
  getRegistrationsByStudent,
  getRegistrationsByGuardian,
  createRegistration,
  updateRegistration,
  deleteRegistration,
} from "../controllers/registrationController.js";

const router = express.Router();

router.get("/", getAllRegistrations);
router.get("/student/:studentId", getRegistrationsByStudent);
router.get("/guardian/:guardianId", getRegistrationsByGuardian);
router.get("/:id", getRegistrationById);
router.post("/", createRegistration);
router.put("/:id", updateRegistration);
router.delete("/:id", deleteRegistration);

export default router;

