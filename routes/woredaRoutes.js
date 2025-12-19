import express from "express";
import {
  getAllWoredas,
  getWoredaById,
  getWoredasByDiocese,
  createWoreda,
  updateWoreda,
  deleteWoreda,
} from "../controllers/woredaController.js";

const router = express.Router();

router.get("/", getAllWoredas);
router.get("/diocese/:dioceseId", getWoredasByDiocese);
router.get("/:id", getWoredaById);
router.post("/", createWoreda);
router.put("/:id", updateWoreda);
router.delete("/:id", deleteWoreda);

export default router;

