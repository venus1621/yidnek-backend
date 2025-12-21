import TeacherAssign from "../models/teacherAssign.js";
import Class from "../models/Class.js";
import Teacher from "../models/Teacher.js";

/**
 * Get all teacher assignments
 */
export const getAllTeacherAssigns = async (req, res) => {
  try {
    const assigns = await TeacherAssign.find()
      .populate("classId")
      .populate("teacherId");

    res.json(assigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get single teacher assignment by ID
 */
export const getTeacherAssignById = async (req, res) => {
  try {
    const assign = await TeacherAssign.findById(req.params.id)
      .populate("classId")
      .populate("teacherId");

    if (!assign) {
      return res.status(404).json({ error: "Teacher assignment not found" });
    }

    res.json(assign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get teacher assignments by class
 */
export const getTeacherAssignsByClass = async (req, res) => {
  try {
    const assigns = await TeacherAssign.find({
      classId: req.params.classId,
    })
      .populate("classId")
      .populate("teacherId");

    res.json(assigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get teacher assignments by teacher
 */
export const getTeacherAssignsByTeacher = async (req, res) => {
  try {
    const assigns = await TeacherAssign.find({
      teacherId: req.params.teacherId,
    })
      .populate("classId")
      .populate("teacherId");

    res.json(assigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create teacher assignment
 */
export const createTeacherAssign = async (req, res) => {
  try {
    // Verify class exists
    const classItem = await Class.findById(req.body.classId);
    if (!classItem) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Verify teacher exists
    const teacher = await Teacher.findById(req.body.teacherId);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const assign = new TeacherAssign(req.body);
    await assign.save();

    const populatedAssign = await TeacherAssign.findById(assign._id)
      .populate("classId")
      .populate("teacherId");

    res.status(201).json(populatedAssign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Update teacher assignment
 */
export const updateTeacherAssign = async (req, res) => {
  try {
    const assign = await TeacherAssign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("classId")
      .populate("teacherId");

    if (!assign) {
      return res.status(404).json({ error: "Teacher assignment not found" });
    }

    res.json(assign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete teacher assignment
 */
export const deleteTeacherAssign = async (req, res) => {
  try {
    const assign = await TeacherAssign.findByIdAndDelete(req.params.id);

    if (!assign) {
      return res.status(404).json({ error: "Teacher assignment not found" });
    }

    res.json({ message: "Teacher assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
