import express from "express";
import {
  getAllSundaySchools,
  getSundaySchoolById,
  getSundaySchoolsByWoreda,
  createSundaySchool,
  updateSundaySchool,
  deleteSundaySchool,
} from "../controllers/sundaySchoolController.js";

const router = express.Router();

router.get("/", getAllSundaySchools);
router.get("/woreda/:woredaId", getSundaySchoolsByWoreda);
router.get("/:id", getSundaySchoolById);
router.post("/", createSundaySchool);
router.put("/:id", updateSundaySchool);
router.delete("/:id", deleteSundaySchool);

export default router;

