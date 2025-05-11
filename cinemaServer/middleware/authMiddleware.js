const jwt = require("jsonwebtoken");
const { getLoggedUserDetails } = require("../services/userDBServ");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    if (!authHeader)
      return res
        .status(401)
        .header("Access-Control-Expose-Headers", "X-Unauth-Reason")
        .header("X-Unauth-Reason", "invalid-token")
        .send({ message: "Unauthorized" });

    // const { data: user } = getLoggedUserDetails(authHeader);
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded; // Now you can use req.user in any route
    next();
  } catch (error) {
    return res
      .status(401)
      .header("Access-Control-Expose-Headers", "X-Unauth-Reason")
      .header("X-Unauth-Reason", "invalid-token")
      .json({ message: `Invalid varifyToken :${error.message}` });
  }
};

module.exports = { authMiddleware };
