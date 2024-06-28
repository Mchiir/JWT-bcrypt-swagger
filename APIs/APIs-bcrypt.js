import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { Users } from '../models/models.js';
import dotenv from 'dotenv';
dotenv.config({ path:'./.env' });
const TOKEN_EXP = process.env.JWT_EXPIRATION;
// console.log(TOKEN_EXP);

const router = express.Router();

// Register route for users
router.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(req.body);

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new Users({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login route for users
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        console.log(req.body);
        const user = await Users.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Compare the plaintext password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token with a longer expiration time
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: TOKEN_EXP || '1m' }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export { router };