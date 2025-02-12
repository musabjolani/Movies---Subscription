const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    if (!authHeader) return res.status(401).send({ message: "Unauthorized" });
    const token = authHeader.split(" ")[1];

    if (!token) return res.status(404).json(error.message);
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decode;
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: `Invalid varifyToken :${error.message}` });
  }
};

module.exports = { authMiddleware };
