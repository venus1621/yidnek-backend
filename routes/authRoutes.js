import express from "express";
import { showLogin, login, logout, checkAuth } from "../controllers/authController.js";
import { createAdminFromForm } from "../controllers/userController.js";

const router = express.Router();

router.get("/login", showLogin);
router.post("/login", login);
router.get("/logout", logout);
router.get("/auth/check", checkAuth);
router.get("/me", checkAuth);

// Super Admin: create other admin/user accounts via API
router.post("/admin/users", createAdminFromForm);

export default router;

