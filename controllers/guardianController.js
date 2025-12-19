import Guardian from "../models/Guardian.js";
import SundaySchool from "../models/SundaySchool.js";

// Get all guardians
export const getAllGuardians = async (req, res) => {
  try {
    const guardians = await Guardian.find().populate("sundaySchoolId");
    res.json(guardians);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single guardian
export const getGuardianById = async (req, res) => {
  try {
    const guardian = await Guardian.findById(req.params.id).populate("sundaySchoolId");
    if (!guardian) {
      return res.status(404).json({ error: "Guardian not found" });
    }
    res.json(guardian);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get guardians by Sunday school
export const getGuardiansBySundaySchool = async (req, res) => {
  try {
    const guardians = await Guardian.find({ sundaySchoolId: req.params.sundaySchoolId })
      .populate("sundaySchoolId");
    res.json(guardians);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create guardian
export const createGuardian = async (req, res) => {
  try {
    // Verify Sunday school exists if provided
    if (req.body.sundaySchoolId) {
      const sundaySchool = await SundaySchool.findById(req.body.sundaySchoolId);
      if (!sundaySchool) {
        return res.status(404).json({ error: "Sunday school not found" });
      }
    }
    const guardian = new Guardian(req.body);
    await guardian.save();
    const populated = await Guardian.findById(guardian._id).populate("sundaySchoolId");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update guardian
export const updateGuardian = async (req, res) => {
  try {
    const guardian = await Guardian.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("sundaySchoolId");
    if (!guardian) {
      return res.status(404).json({ error: "Guardian not found" });
    }
    res.json(guardian);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete guardian
export const deleteGuardian = async (req, res) => {
  try {
    const guardian = await Guardian.findByIdAndDelete(req.params.id);
    if (!guardian) {
      return res.status(404).json({ error: "Guardian not found" });
    }
    res.json({ message: "Guardian deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

