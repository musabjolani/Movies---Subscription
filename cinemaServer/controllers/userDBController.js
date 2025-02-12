const express = require("express");
const router = express.Router();
const userDBServ = require("../services/userDBServ");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.JWT_SECRET_KEY; // Define at the top

router.get("/", async (req, res) => {
  try {
    res.json(await userDBServ.getAllUsers());
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});

router.get("/getUserDetails", (req, res) => {
  res.json({ user: req.user });
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    res.json(await userDBServ.getUserByUserId(userId));
  } catch (error) {
    res.status(404).json(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const user = req.body;
    // if 'username' is exist in the DB
    const userDB = await userDBServ.getUserAuth(user.userName);
    if (userDB)
      return res.status(401).json({ message: " userName already Exist !!!" });
    res.json(await userDBServ.addUser(user));
  } catch (error) {
    res.status(404).json(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Handle SYSAdmin login (Hardcoded Admin Credentials - Ideally store securely)
    if (userName.toLowerCase() === "sysadmin" && password === "1234") {
      const token = jwt.sign({ userName, isAdmin: true }, SECRET_KEY, {
        expiresIn: "1h",
      });
      return res.json(token); //  Return token properly
    }

    // Retrieve user from DB (Ensure case-insensitive search)

    const user = await userDBServ.getUserAuth(userName);

    if (!user) return res.status(401).json({ message: "Invalid username" });

    // Check if the user has a password set (Prompt for reset if missing)
    if (!user.password) {
      return res.status(401).json({ message: "Reset password Please" });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userName: user.userName, isAdmin: false },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    return res.json(token);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

router.post("/register", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await userDBServ.getUserAuth(userName);
    if (!user)
      return res.status(401).json({ message: "userName ia not exist" });
    const hashedPassword = await bcrypt.hash(password, 10);
    res.json(
      await userDBServ.updateUserByID(user._id, { password: hashedPassword })
    );
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = req.body;
    res.json(await userDBServ.updateUserByUserId(userId, user));
  } catch (error) {
    res.status(404).json(error.message);
  }
});
router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    res.json(await userDBServ.deleteUserByUserId(userId));
  } catch (error) {
    res.status(404).json(error.message);
  }
});

module.exports = router;
