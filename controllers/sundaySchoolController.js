import SundaySchool from "../models/SundaySchool.js";
import Woreda from "../models/Woreda.js";

// Get all Sunday schools
export const getAllSundaySchools = async (req, res) => {
  try {
    const sundaySchools = await SundaySchool.find().populate("woredaId");
    res.json(sundaySchools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single Sunday school
export const getSundaySchoolById = async (req, res) => {
  try {
    const sundaySchool = await SundaySchool.findById(req.params.id)
      .populate("woredaId")
      .populate("dioceseId")
      .populate("churchId");
    if (!sundaySchool) {
      return res.status(404).json({ error: "Sunday school not found" });
    }
    res.json(sundaySchool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Sunday schools by woreda
export const getSundaySchoolsByWoreda = async (req, res) => {
  try {
    const sundaySchools = await SundaySchool.find({ woredaId: req.params.woredaId })
      .populate("woredaId");
    res.json(sundaySchools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Sunday school
export const createSundaySchool = async (req, res) => {
  try {
    // Verify woreda exists
    const woreda = await Woreda.findById(req.body.woredaId);
    if (!woreda) {
      return res.status(404).json({ error: "Woreda not found" });
    }
    const sundaySchool = new SundaySchool(req.body);
    await sundaySchool.save();
    const populated = await SundaySchool.findById(sundaySchool._id).populate("woredaId");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Sunday school
export const updateSundaySchool = async (req, res) => {
  try {
    const sundaySchool = await SundaySchool.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("woredaId");
    if (!sundaySchool) {
      return res.status(404).json({ error: "Sunday school not found" });
    }
    res.json(sundaySchool);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Sunday school
export const deleteSundaySchool = async (req, res) => {
  try {
    const sundaySchool = await SundaySchool.findByIdAndDelete(req.params.id);
    if (!sundaySchool) {
      return res.status(404).json({ error: "Sunday school not found" });
    }
    res.json({ message: "Sunday school deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

