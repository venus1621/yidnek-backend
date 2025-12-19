import Diocese from "../models/Diocese.js";
import Church from "../models/Church.js";

// Get all dioceses
export const getAllDioceses = async (req, res) => {
  try {
    const dioceses = await Diocese.find().populate("churchId");
    res.json(dioceses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single diocese
export const getDioceseById = async (req, res) => {
  try {
    const diocese = await Diocese.findById(req.params.id).populate("churchId");
    if (!diocese) {
      return res.status(404).json({ error: "Diocese not found" });
    }
    res.json(diocese);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get dioceses by church
export const getDiocesesByChurch = async (req, res) => {
  try {
    const dioceses = await Diocese.find({ churchId: req.params.churchId })
      .populate("churchId");
    res.json(dioceses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create diocese
export const createDiocese = async (req, res) => {
  try {
    // Verify church exists
    const church = await Church.findById(req.body.churchId);
    if (!church) {
      return res.status(404).json({ error: "Church not found" });
    }
    const diocese = new Diocese(req.body);
    await diocese.save();
    const populated = await Diocese.findById(diocese._id).populate("churchId");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update diocese
export const updateDiocese = async (req, res) => {
  try {
    const diocese = await Diocese.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("churchId");
    if (!diocese) {
      return res.status(404).json({ error: "Diocese not found" });
    }
    res.json(diocese);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete diocese
export const deleteDiocese = async (req, res) => {
  try {
    const diocese = await Diocese.findByIdAndDelete(req.params.id);
    if (!diocese) {
      return res.status(404).json({ error: "Diocese not found" });
    }
    res.json({ message: "Diocese deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

