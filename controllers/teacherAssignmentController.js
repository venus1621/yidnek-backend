import TeacherAssignment from "../models/TeacherAssignment.js";
import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";

// Get all teacher assignments
export const getAllTeacherAssignments = async (req, res) => {
  try {
    const assignments = await TeacherAssignment.find()
      .populate("teacherId")
      .populate("classId");
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single teacher assignment
export const getTeacherAssignmentById = async (req, res) => {
  try {
    const assignment = await TeacherAssignment.findById(req.params.id)
      .populate("teacherId")
      .populate("classId");
    if (!assignment) {
      return res.status(404).json({ error: "Teacher assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get assignments by teacher
export const getAssignmentsByTeacher = async (req, res) => {
  try {
    const assignments = await TeacherAssignment.find({ teacherId: req.params.teacherId })
      .populate("teacherId")
      .populate("classId");
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get assignments by class
export const getAssignmentsByClass = async (req, res) => {
  try {
    const assignments = await TeacherAssignment.find({ classId: req.params.classId })
      .populate("teacherId")
      .populate("classId");
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create teacher assignment
export const createTeacherAssignment = async (req, res) => {
  try {
    // Verify teacher and class exist
    const teacher = await Teacher.findById(req.body.teacherId);
    const classItem = await Class.findById(req.body.classId);
    
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    if (!classItem) {
      return res.status(404).json({ error: "Class not found" });
    }
    
    const assignment = new TeacherAssignment(req.body);
    await assignment.save();
    const populated = await TeacherAssignment.findById(assignment._id)
      .populate("teacherId")
      .populate("classId");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update teacher assignment
export const updateTeacherAssignment = async (req, res) => {
  try {
    const assignment = await TeacherAssignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("teacherId")
      .populate("classId");
    if (!assignment) {
      return res.status(404).json({ error: "Teacher assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete teacher assignment
export const deleteTeacherAssignment = async (req, res) => {
  try {
    const assignment = await TeacherAssignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: "Teacher assignment not found" });
    }
    res.json({ message: "Teacher assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

