import Woreda from "../models/Woreda.js";
import Diocese from "../models/Diocese.js";

// Get all woredas
export const getAllWoredas = async (req, res) => {
  try {
    const woredas = await Woreda.find().populate("dioceseId");
    res.json(woredas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single woreda
export const getWoredaById = async (req, res) => {
  try {
    const woreda = await Woreda.findById(req.params.id).populate("dioceseId");
    if (!woreda) {
      return res.status(404).json({ error: "Woreda not found" });
    }
    res.json(woreda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get woredas by diocese
export const getWoredasByDiocese = async (req, res) => {
  try {
    const woredas = await Woreda.find({ dioceseId: req.params.dioceseId })
      .populate("dioceseId");
    res.json(woredas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create woreda
export const createWoreda = async (req, res) => {
  try {
    // Verify diocese exists
    const diocese = await Diocese.findById(req.body.dioceseId);
    if (!diocese) {
      return res.status(404).json({ error: "Diocese not found" });
    }
    const woreda = new Woreda(req.body);
    await woreda.save();
    const populated = await Woreda.findById(woreda._id).populate("dioceseId");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update woreda
export const updateWoreda = async (req, res) => {
  try {
    const woreda = await Woreda.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("dioceseId");
    if (!woreda) {
      return res.status(404).json({ error: "Woreda not found" });
    }
    res.json(woreda);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete woreda
export const deleteWoreda = async (req, res) => {
  try {
    const woreda = await Woreda.findByIdAndDelete(req.params.id);
    if (!woreda) {
      return res.status(404).json({ error: "Woreda not found" });
    }
    res.json({ message: "Woreda deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

