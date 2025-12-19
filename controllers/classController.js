import Class from "../models/Class.js";
import SundaySchool from "../models/SundaySchool.js";

// Get all classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate("sundaySchoolId");
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single class
export const getClassById = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id).populate("sundaySchoolId");
    if (!classItem) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get classes by Sunday school
export const getClassesBySundaySchool = async (req, res) => {
  try {
    const classes = await Class.find({ sundaySchoolId: req.params.sundaySchoolId })
      .populate("sundaySchoolId");
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create class
export const createClass = async (req, res) => {
  try {
    // Verify Sunday school exists
    const sundaySchool = await SundaySchool.findById(req.body.sundaySchoolId);
    if (!sundaySchool) {
      return res.status(404).json({ error: "Sunday school not found" });
    }
    const classItem = new Class(req.body);
    await classItem.save();
    const populated = await Class.findById(classItem._id).populate("sundaySchoolId");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update class
export const updateClass = async (req, res) => {
  try {
    const classItem = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("sundaySchoolId");
    if (!classItem) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json(classItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete class
export const deleteClass = async (req, res) => {
  try {
    const classItem = await Class.findByIdAndDelete(req.params.id);
    if (!classItem) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

