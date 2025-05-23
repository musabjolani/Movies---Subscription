const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRouter = require("./controllers/userController");
const permissionRouter = require("./controllers/permissionController");
const userDBRouter = require("./controllers/userDBController");
const { authMiddleware } = require("./middleware/authMiddleware");

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use("/", express.json());

connectDB();

app.use((req, res, next) => {
  const excludedRoutes = ["/userDB/login", "/userDB/register"]; // Define routes to exclude
  if (excludedRoutes.includes(req.path)) {
    return next(); // Skip authMiddleware
  }
  authMiddleware(req, res, next);
});
app.use("/users", userRouter);
app.use("/permissions", permissionRouter);
app.use("/userDB", userDBRouter);

app.listen(PORT, () => {
  console.log(`app is listening at http://localhost:${PORT}`);
});
