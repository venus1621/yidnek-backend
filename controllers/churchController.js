import Church from "../models/Church.js";

// Get all churches
export const getAllChurches = async (req, res) => {
  try {
    const churches = await Church.find();
    res.json(churches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single church
export const getChurchById = async (req, res) => {
  try {
    const church = await Church.findById(req.params.id);
    if (!church) {
      return res.status(404).json({ error: "Church not found" });
    }
    res.json(church);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create church
export const createChurch = async (req, res) => {
  try {
    const church = new Church(req.body);
    await church.save();
    res.status(201).json(church);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update church
export const updateChurch = async (req, res) => {
  try {
    const church = await Church.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!church) {
      return res.status(404).json({ error: "Church not found" });
    }
    res.json(church);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete church
export const deleteChurch = async (req, res) => {
  try {
    const church = await Church.findByIdAndDelete(req.params.id);
    if (!church) {
      return res.status(404).json({ error: "Church not found" });
    }
    res.json({ message: "Church deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

