const jwt = require("jsonwebtoken");
const axios = require("axios");
const authMiddleware = async (req, res, next) => {
  try {
    const url = `${process.env.CINEMA_SERVER_URL}`;

    const authHeader = req.headers.Authorization || req.headers.authorization;
    if (!authHeader)
      return res
        .status(401)
        .header("Access-Control-Expose-Headers", "X-Unauth-Reason")
        .header("X-Unauth-Reason", "invalid-token")
        .send({ message: "Unauthorized" });

    const { data: user } = await axios.get(url, {
      headers: {
        Authorization: authHeader,
      },
    });
    req.user = user; // Now you can use req.user in any route
    next();
  } catch (error) {
    return res
      .status(401)
      .header("X-Unauth-Reason", "invalid-token")
      .json({ message: `Invalid varifyToken :${error.message}` });
  }
};

module.exports = { authMiddleware };
