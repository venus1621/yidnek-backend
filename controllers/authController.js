import User from "../models/User.js";

export const showLogin = (req, res) => {
  res.json({ message: "Send POST /login with username and password" });
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  const user = await User.findOne({ username }).populate("roles");
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  // NOTE: passwordHash is assumed to store plaintext or pre-hashed value.
  // Replace with proper hash comparison (e.g., bcrypt) when available.
  if (user.passwordHash !== password) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const roleName = user.roles?.[0]?.name || null;
  req.session.userId = user._id.toString();
  req.session.roleName = roleName;
  req.session.username = user.username;
  req.session.sundaySchoolId = user.sundaySchoolId || null;
  
  return res.json({
    message: "Login successful",
    userId: user._id.toString(),
    username: user.username,
    roleName,
    sundaySchoolId: user.sundaySchoolId || null,
    teacherId: user.teacherId || null,
  });
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
};

/**
 * Check if user is authenticated
 */
export const checkAuth = (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({
      authenticated: true,
      userId: req.session.userId,
      username: req.session.username,
      roleName: req.session.roleName,
      sundaySchoolId: req.session.sundaySchoolId,
    });
  }
  
  return res.status(401).json({
    authenticated: false,
    error: "Not logged in",
  });
};

