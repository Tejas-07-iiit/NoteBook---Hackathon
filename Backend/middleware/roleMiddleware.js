exports.requireRole = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  console.log(`🔒 Role Check: User Role = ${req.user.role} | Required = ${roles}`);

  if (!roles.includes(req.user.role)) {
    console.log("❌ Access Denied: Role mismatch");
    return res.status(403).json({
      message: "Access denied",
      requiredRoles: roles,
      yourRole: req.user.role
    });
  }

  next();
};