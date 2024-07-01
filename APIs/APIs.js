import express from "express";
import jwt from "jsonwebtoken";
import { Users } from "../models/models.js";
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
const TOKEN_EXP = process.env.JWT_EXPIRATION;
// console.log(TOKEN_EXP);

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);
    const user = new Users({ username, password });
    await user.save();
    res.status(201).json({ message: "New user registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Users.findOne({ username });
    console.log(user);

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRATION || "1h"
    }
    );
    // res.setHeader('x-access-token', token);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


export { router };