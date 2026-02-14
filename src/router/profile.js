const express = require('express');
const profileRouter = express.Router();
const bcrypt = require('bcrypt'); 
const { authuser } = require("../middlewares/auth.js");
const User = require('../models/user.js');
const { validateEditProfileData } = require("../utils/validate.js");


profileRouter.get("/profile", authuser, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(500).send("Error fetching profile: " + error.message);
    }
});


profileRouter.get("/profile/view", authuser, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(500).send("Error fetching profile: " + error.message);
    }
});




profileRouter.patch("/profile/edit", authuser, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            return res.status(400).send("Invalid Edit Request");
        }
        const user = req.user;


        for (const key of Object.keys(req.body)) {
            if (key === "password") {

                user[key] = await bcrypt.hash(req.body[key], 10);
            } else {
                user[key] = req.body[key];
            }
        }

        await user.save();
        res.json({ message: "Profile updated successfully", data: user });
    } catch (error) {
        res.status(400).send("UPDATE FAILED: " + error.message);
    }
});

module.exports = profileRouter;
