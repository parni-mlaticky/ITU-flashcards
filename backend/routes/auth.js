const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const RegisteredUser = require("../objects/RegisteredUser");

module.exports = router;

router.post("/login", async (req, res) => {
  try {
    if (req.user) {
      return res.status(200).json({ message: "Already logged in" });
    }
    const { username, password } = req.body;
    const user = await RegisteredUser.getByUsername(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({ message: "Logged in" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await RegisteredUser.getByUsername(username);
    if (user) {
      return res.status(409).json({ message: "Username already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    let newUser = new RegisteredUser({
      username,
      password: hashedPassword,
    });
    newUser = await newUser.save();
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({ message: "Registered" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
});
