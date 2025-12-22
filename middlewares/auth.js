/**
 * Authentication middleware
 * Checks if user is logged in via session
 */
export const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ 
      error: "Session expired or not logged in",
      code: "AUTH_REQUIRED",
      message: "Please log in again to continue"
    });
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

