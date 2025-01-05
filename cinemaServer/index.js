const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRouter = require("./controllers/userController");
const permissionRouter = require("./controllers/permissionController");
const userDBController = require("./controllers/userDBController");
const dotenv = require("dotenv").config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use("/", express.json());

connectDB();

app.use("/users", userRouter);
app.use("/permissions", permissionRouter);
app.use("/userDB", userDBController);

app.listen(PORT, () => {
  console.log(`app is listening at http://localhost:${PORT}`);
});
