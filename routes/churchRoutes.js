import express from "express";
import {
  getAllChurches,
  getChurchById,
  createChurch,
  updateChurch,
  deleteChurch,
} from "../controllers/churchController.js";

const router = express.Router();

router.get("/", getAllChurches);
router.get("/:id", getChurchById);
router.post("/", createChurch);
router.put("/:id", updateChurch);
router.delete("/:id", deleteChurch);

export default router;

