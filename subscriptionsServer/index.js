const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const memeberController = require("./controllers/memeberController");
const movieController = require("./controllers/movieController");
const subscriptionController = require("./controllers/subscriptionController");
const { authMiddleware } = require("./middleware/authMiddleware");

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use("/", express.json());

app.use((req, res, next) => {
  const excludedRoutes = []; // Define routes to exclude
  if (excludedRoutes.includes(req.path)) {
    return next(); // Skip authMiddleware
  }
  authMiddleware(req, res, next);
});

app.use("/members", memeberController);
app.use("/movies", movieController);
app.use("/subscriptions", subscriptionController);

connectDB();

app.listen(PORT, () => {
  console.log(`app is listening at http://localhost:${PORT}`);
});
