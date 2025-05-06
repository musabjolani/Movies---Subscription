const permissionMiddleware = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized permissionMiddleware: No user data found",
        });
      }
      if (req.user.isAdmin) return next(); // Admins have all permissions
      if (
        !req.user.permissions ||
        !req.user.permissions.includes(requiredPermission)
      ) {
        return res
          .status(403)
          .header("Access-Control-Expose-Headers", "X-Unauth-Reason")
          .header("X-Unauth-Reason", "insufficient-permissions")
          .json({ message: "Access Denied: Insufficient permissions" });
      }
      return next();
    } catch (error) {
      return res
        .status(403)
        .send({ message: `Error permissionMiddleware ${error.r.message}` });
    }
  };
};

module.exports = { permissionMiddleware };
