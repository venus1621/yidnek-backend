import Registration from "../models/Registration.js";
import Student from "../models/Student.js";

// Get all registrations
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("studentId")
      .populate("guardianId");
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single registration
export const getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate("studentId")
      .populate("guardianId");
    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }
    res.json(registration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get registrations by student
export const getRegistrationsByStudent = async (req, res) => {
  try {
    const registrations = await Registration.find({
      studentId: req.params.studentId,
    })
      .populate("studentId")
      .populate("guardianId");
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create registration
export const createRegistration = async (req, res) => {
  try {
    // Verify student and guardian exist
    const student = await Student.findById(req.body.studentId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const registration = new Registration(req.body);
    await registration.save();
    const populated = await Registration.findById(registration._id).populate(
      "studentId"
    );

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update registration
export const updateRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("studentId")
      .populate("guardianId");
    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }
    res.json(registration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete registration
export const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }
    res.json({ message: "Registration deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

