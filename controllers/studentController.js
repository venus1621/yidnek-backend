import Student from "../models/Student.js";

// Get all students for super admin 
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentBySundayschool = async (req, res) => {
  try {
    const students = await Student.find({ sundaySchoolId: req.params.sundaySchoolId });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single student
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create student
export const createStudent = async (req, res) => {
  try {
    // 1. Check if user is authenticated
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // 2. Get the sundaySchoolId from the session (set during login)
    const sundaySchoolId = req.session.sundaySchoolId;

    if (!sundaySchoolId) {
      return res
        .status(403)
        .json({ error: "You are not assigned to any Sunday School" });
    }

    // 3. Prevent client from overriding sundaySchoolId
    // Remove it from req.body if someone tries to send it
    const { sundaySchoolId: _, ...studentData } = req.body;

    // 4. Create student with the session's sundaySchoolId
    const student = new Student({
      ...studentData,
      sundaySchoolId, // Automatically set from session
    });

    await student.save();

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

