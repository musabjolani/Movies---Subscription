const jwt = require("jsonwebtoken");
const { getLoggedUserDetails } = require("../services/userDBServ");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    if (!authHeader)
      return res
        .status(401)
        .header("X-Unauth-Reason", "invalid-token")
        .send({ message: "Unauthorized" });

    // const { data: user } = getLoggedUserDetails(authHeader);

    return next();
  } catch (error) {
    return res
      .status(401)
      .header("X-Unauth-Reason", "invalid-token")
      .json({ message: `Invalid varifyToken :${error.message}` });
  }
};

module.exports = { authMiddleware };
