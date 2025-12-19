import ClassEnrollment from "../models/ClassEnrollment.js";
import Student from "../models/Student.js";
import Class from "../models/Class.js";

// Get all class enrollments
export const getAllClassEnrollments = async (req, res) => {
  try {
    const enrollments = await ClassEnrollment.find()
      .populate("studentId")
      .populate("classId");
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single class enrollment
export const getClassEnrollmentById = async (req, res) => {
  try {
    const enrollment = await ClassEnrollment.findById(req.params.id)
      .populate("studentId")
      .populate("classId");
    if (!enrollment) {
      return res.status(404).json({ error: "Class enrollment not found" });
    }
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get enrollments by student
export const getEnrollmentsByStudent = async (req, res) => {
  try {
    const enrollments = await ClassEnrollment.find({ studentId: req.params.studentId })
      .populate("studentId")
      .populate("classId");
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get enrollments by class
export const getEnrollmentsByClass = async (req, res) => {
  try {
    const enrollments = await ClassEnrollment.find({ classId: req.params.classId })
      .populate("studentId")
      .populate("classId");
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create class enrollment
export const createClassEnrollment = async (req, res) => {
  try {
    // Verify student and class exist
    const student = await Student.findById(req.body.studentId);
    const classItem = await Class.findById(req.body.classId);
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    if (!classItem) {
      return res.status(404).json({ error: "Class not found" });
    }
    
    const enrollment = new ClassEnrollment(req.body);
    await enrollment.save();
    const populated = await ClassEnrollment.findById(enrollment._id)
      .populate("studentId")
      .populate("classId");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update class enrollment
export const updateClassEnrollment = async (req, res) => {
  try {
    const enrollment = await ClassEnrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("studentId")
      .populate("classId");
    if (!enrollment) {
      return res.status(404).json({ error: "Class enrollment not found" });
    }
    res.json(enrollment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete class enrollment
export const deleteClassEnrollment = async (req, res) => {
  try {
    const enrollment = await ClassEnrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ error: "Class enrollment not found" });
    }
    res.json({ message: "Class enrollment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

