import express from "express";
import {
  getAllDioceses,
  getDioceseById,
  getDiocesesByChurch,
  createDiocese,
  updateDiocese,
  deleteDiocese,
} from "../controllers/dioceseController.js";

const router = express.Router();

router.get("/", getAllDioceses);
router.get("/church/:churchId", getDiocesesByChurch);
router.get("/:id", getDioceseById);
router.post("/", createDiocese);
router.put("/:id", updateDiocese);
router.delete("/:id", deleteDiocese);

export default router;

