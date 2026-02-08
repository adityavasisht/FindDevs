const express = require('express');

const authRouter = express.Router();
const User = require('../models/user.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email.js');



authRouter.post("/signup", async (req, res) => {
    try {
        const { firstname, lastname, emailId, password } = req.body;
        

        const existingUser = await User.findOne({ emailId });
        if (existingUser) return res.status(400).send("Email already registered");

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({
            firstname,
            lastname,
            emailId,
            password: hashed
        });
        
        await user.save();


        sendEmail(
            user.emailId,
            "Welcome to FindDevs! 🚀",
            `<h1>Hey ${user.firstname},</h1><p>Ready to meet your next coding partner?</p>`
        ).catch(err => console.error("SES Email Error:", err));

        res.status(201).send("User created successfully");
        
    } catch (error) {

        console.error(error);
        res.status(500).send("Error saving user: " + error.message);
    }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ emailId:email });
    if (!user) {
      console.log("USER NOT FOUND");
      return res.status(404).send("user not found");
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );


    if (!passwordCorrect) {
      return res.status(401).send("invalid credentials");
    }
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET);
    res.cookie("token",token);
    res.send("user login successfull");

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).send("something went wrong");
  }
});

authRouter.post("/logout", async(req,res)=>{
  res.cookie("token", null,{
    expires : new Date(Date.now()),
  })
  res.send("logged out successfully!");
})

module.exports = authRouter;