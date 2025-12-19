import express from "express";
import churchRoutes from "./churchRoutes.js";
import dioceseRoutes from "./dioceseRoutes.js";
import woredaRoutes from "./woredaRoutes.js";
import sundaySchoolRoutes from "./sundaySchoolRoutes.js";
import teacherRoutes from "./teacherRoutes.js";
import classRoutes from "./classRoutes.js";
import teacherAssignmentRoutes from "./teacherAssignmentRoutes.js";
import studentRoutes from "./studentRoutes.js";
import classEnrollmentRoutes from "./classEnrollmentRoutes.js";
import assessmentRoutes from "./assessmentRoutes.js";
import studentMarkRoutes from "./studentMarkRoutes.js";
import guardianRoutes from "./guardianRoutes.js";
import registrationRoutes from "./registrationRoutes.js";
import userRoutes from "./userRoutes.js";
import roleRoutes from "./roleRoutes.js";

const router = express.Router();

// Mount all routes
router.use("/churches", churchRoutes);
router.use("/dioceses", dioceseRoutes);
router.use("/woredas", woredaRoutes);
router.use("/sunday-schools", sundaySchoolRoutes);
router.use("/teachers", teacherRoutes);
router.use("/classes", classRoutes);
router.use("/teacher-assignments", teacherAssignmentRoutes);
router.use("/students", studentRoutes);
router.use("/class-enrollments", classEnrollmentRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/student-marks", studentMarkRoutes);
router.use("/guardians", guardianRoutes);
router.use("/registrations", registrationRoutes);
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);

export default router;

