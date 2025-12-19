import Teacher from "../models/Teacher.js";
import SundaySchool from "../models/SundaySchool.js";

// Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("sundaySchoolId");
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single teacher
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate("sundaySchoolId");
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get teachers by Sunday school
export const getTeachersBySundaySchool = async (req, res) => {
  try {
    const teachers = await Teacher.find({ sundaySchoolId: req.params.sundaySchoolId })
      .populate("sundaySchoolId");
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create teacher
export const createTeacher = async (req, res) => {
  try {
    // Verify Sunday school exists
    const sundaySchool = await SundaySchool.findById(req.body.sundaySchoolId);
    if (!sundaySchool) {
      return res.status(404).json({ error: "Sunday school not found" });
    }
    const teacher = new Teacher(req.body);
    await teacher.save();
    const populated = await Teacher.findById(teacher._id).populate("sundaySchoolId");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update teacher
export const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("sundaySchoolId");
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete teacher
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

