import StudentMark from "../models/StudentMark.js";
import Assessment from "../models/Assessment.js";
import Student from "../models/Student.js";

// Get all student marks
export const getAllStudentMarks = async (req, res) => {
  try {
    const marks = await StudentMark.find()
      .populate("assessmentId")
      .populate("studentId");
    res.json(marks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single student mark
export const getStudentMarkById = async (req, res) => {
  try {
    const mark = await StudentMark.findById(req.params.id)
      .populate("assessmentId")
      .populate("studentId");
    if (!mark) {
      return res.status(404).json({ error: "Student mark not found" });
    }
    res.json(mark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get marks by assessment
export const getMarksByAssessment = async (req, res) => {
  try {
    const marks = await StudentMark.find({ assessmentId: req.params.assessmentId })
      .populate("assessmentId")
      .populate("studentId");
    res.json(marks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get marks by student
export const getMarksByStudent = async (req, res) => {
  try {
    const marks = await StudentMark.find({ studentId: req.params.studentId })
      .populate("assessmentId")
      .populate("studentId");
    res.json(marks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create student mark
export const createStudentMark = async (req, res) => {
  try {
    // Verify assessment and student exist
    const assessment = await Assessment.findById(req.body.assessmentId);
    const student = await Student.findById(req.body.studentId);
    
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    // Validate score doesn't exceed maxScore
    if (req.body.score > assessment.maxScore) {
      return res.status(400).json({ error: "Score exceeds maximum score" });
    }
    
    const mark = new StudentMark(req.body);
    await mark.save();
    const populated = await StudentMark.findById(mark._id)
      .populate("assessmentId")
      .populate("studentId");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update student mark
export const updateStudentMark = async (req, res) => {
  try {
    // If score is being updated, validate against maxScore
    if (req.body.score) {
      const existingMark = await StudentMark.findById(req.params.id).populate("assessmentId");
      if (!existingMark) {
        return res.status(404).json({ error: "Student mark not found" });
      }
      if (req.body.score > existingMark.assessmentId.maxScore) {
        return res.status(400).json({ error: "Score exceeds maximum score" });
      }
    }
    
    const updatedMark = await StudentMark.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("assessmentId")
      .populate("studentId");
    if (!updatedMark) {
      return res.status(404).json({ error: "Student mark not found" });
    }
    res.json(updatedMark);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete student mark
export const deleteStudentMark = async (req, res) => {
  try {
    const mark = await StudentMark.findByIdAndDelete(req.params.id);
    if (!mark) {
      return res.status(404).json({ error: "Student mark not found" });
    }
    res.json({ message: "Student mark deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

