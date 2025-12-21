import Assessment from "../models/Assessment.js";
import Class from "../models/Class.js";
import Teacher from "../models/Teacher.js";

// Get all assessments
export const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find()
      .populate("classId")
      .populate("teacherId");
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single assessment
export const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate("classId")
      .populate("teacherId");
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get assessments by class
export const getAssessmentsByClass = async (req, res) => {
  try {
    const assessments = await Assessment.find({ classId: req.params.classId })
      .populate("classId")
      .populate("teacherId");
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get assessments by teacher
export const getAssessmentsByTeacher = async (req, res) => {
  try {
    const assessments = await Assessment.find({
      teacherId: req.params.teacherId,
    })
      .populate("classId")
      .populate("teacherId");
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create assessment
export const createAssessment = async (req, res) => {
  try {
    // Verify class and teacher exist
    const classItem = await Class.findById(req.body.classId);
    const teacher = await Teacher.findById(req.body.teacherId);

    if (!classItem) {
      return res.status(404).json({ error: "Class not found" });
    }
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const assessment = new Assessment(req.body);
    await assessment.save();
    const populated = await Assessment.findById(assessment._id)
      .populate("classId")
      .populate("teacherId");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update assessment
export const updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("classId")
      .populate("teacherId");
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }
    res.json(assessment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete assessment
export const deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }
    res.json({ message: "Assessment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
