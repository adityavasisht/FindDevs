const express = require('express');
const profileRouter = express.Router();
const { authuser } = require("../middlewares/auth.js");
const User = require('../models/user.js');
const { validateEditProfileData } = require("../utils/validate.js");

// === ROUTE 1: For Profile/Feed Page ===
profileRouter.get("/profile", authuser, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(500).send("Error fetching profile: " + error.message);
    }
});

// === ROUTE 2: For Chat Page (Alias) ===
profileRouter.get("/profile/view", authuser, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(500).send("Error fetching profile: " + error.message);
    }
});

// === UPDATE ROUTE ===
profileRouter.patch("/profile/edit", authuser, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            return res.status(400).send("Invalid Edit Request");
        }
        const user = req.user;
        Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
        await user.save();
        res.json({ message: "Profile updated successfully", data: user });
    } catch (error) {
        res.status(400).send("UPDATE FAILED: " + error.message);
    }
});

module.exports = profileRouter;
