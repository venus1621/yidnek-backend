import Role from "../models/Role.js";

// Get all roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single role
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create role (name only)
export const createRole = async (req, res) => {
  try {
    const { name } = req.body;
    const role = new Role({ name });
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update role (name only)
export const updateRole = async (req, res) => {
  try {
    const { name } = req.body;
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete role
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

