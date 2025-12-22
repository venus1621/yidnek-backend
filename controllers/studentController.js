import Student from "../models/Student.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

/* ===============================
   MULTER CONFIG (MEMORY)
   Optional photo upload supported
================================ */
const storage = multer.memoryStorage();
export const uploadStudentPhoto = multer({ storage }).single("studentPhoto");

// Get all students for super admin
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentBySundayschool = async (req, res) => {
  try {
    const students = await Student.find({
      sundaySchoolId: req.params.sundaySchoolId,
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single student
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create student
export const createStudent = async (req, res) => {
  try {
    let studentPhotoUrl = null;

    // 🔹 Upload image to Cloudinary if a file is provided
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`,
        {
          folder: "students",
          transformation: [
            { width: 500, height: 500, crop: "auto", gravity: "auto" },
          ],
        }
      );

      studentPhotoUrl = uploadResult.secure_url;
    }

    // Create student with or without photo
    const student = new Student({
      ...req.body,
      studentPhoto: studentPhotoUrl || undefined, // optional
    });
    await student.save();

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
// Update student
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

