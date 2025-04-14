const jwt = require("jsonwebtoken");
const axios = require("axios");

const permissionMiddleware = (requiredPermission) => {
  const url = " http://localhost:3300/userDB/getLoggedUserDetails";
  return async (req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    if (!authHeader)
      return res
        .status(401)
        .header("X-Unauth-Reason", "invalid-token")
        .send({ message: "Unauthorized" });

    const { data: user } = await axios.get(url, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (!user.permissions || !user.permissions.includes(requiredPermission)) {
      return res
        .status(403)
        .header("X-Unauth-Reason", "insufficient-permissions")
        .json({ message: "Access Denied: Insufficient permissions" });
    }
    return next();
  };
};

module.exports = { permissionMiddleware };
