import User from "../models/User.js";
import Role from "../models/Role.js";
import SundaySchool from "../models/SundaySchool.js";
// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("roles");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single user
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("roles");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create user
export const createUser = async (req, res) => {
  try {
    // Verify roles exist if provided
    if (req.body.roles && req.body.roles.length > 0) {
      const roles = await Role.find({ _id: { $in: req.body.roles } });
      if (roles.length !== req.body.roles.length) {
        return res.status(404).json({ error: "One or more roles not found" });
      }
      const sundaySchool = await SundaySchool.findById(req.body.sundaySchoolId);
      if (!sundaySchool) {
        return res.status(404).json({ error: "Sunday School not found" });
      }
    }
    const user = new User(req.body);
    await user.save();
    const populated = await User.findById(user._id).populate("roles");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    // Verify roles exist if being updated
    if (req.body.roles && req.body.roles.length > 0) {
      const roles = await Role.find({ _id: { $in: req.body.roles } });
      if (roles.length !== req.body.roles.length) {
        return res.status(404).json({ error: "One or more roles not found" });
      }
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("roles");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create admin/user from web form (Super Admin only)
export const createAdminFromForm = async (req, res) => {
  try {
    if (req.session?.roleName !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Forbidden: Super Admin only." });
    }

    const { username, password, roleId } = req.body;

    if (!username || !password || !roleId) {
      return res
        .status(400)
        .json({ error: "Username, password and role are required." });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Username already exists. Choose another." });
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ error: "Selected role not found." });
    }

    const user = new User({
      username,
      passwordHash: password, // TODO: replace with hashed password
      roles: [roleId],
    });

    await user.save();

    return res.status(201).json({ message: "User created", userId: user._id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
