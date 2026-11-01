import express from "express";
import User from "../models/UserModel.js";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import { auth } from "../config/firebase-config.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: "Name, email, and password are required." });
        }
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            displayName: name,
        });
        const newUser = new User({
            name: userRecord.displayName,
            email: userRecord.email,
            firebase_user_id: userRecord.uid,
        });
        await newUser.save();
        res.status(201).json({ message: "User created successfully.", user: newUser });
    } catch (error) {
        console.error("Registration Error:", error);
        const errorMessage = error.code === 'auth/email-already-in-use' ? "This email is already registered." : "Failed to create user.";
        res.status(500).json({ error: errorMessage });
    }
});

router.post("/login", firebaseAuthMiddleware, async (req, res) => {
    try {
        const firebaseUID = req.firebaseUser?.uid;
        const user = await User.findOne({ firebase_user_id: firebaseUID });
        if (!user) {
            return res.status(404).json({ error: "User not found in our database. Please sign up first." });
        }
        res.status(200).json({ message: "Login successful.", user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "An error occurred during login." });
    }
});

export default router;