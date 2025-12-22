/**
 * Authentication middleware
 * Checks if user is logged in via session
 */
export const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Populate req.user for controllers
  req.user = {
    id: req.session.userId,
    username: req.session.username,
    roleName: req.session.roleName,
    sundaySchoolId: req.session.sundaySchoolId,
  };

  next();
};

