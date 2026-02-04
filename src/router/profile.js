const express = require('express');
const profileRouter = express.Router();
const {authuser} = require("../middlewares/auth.js")
const User = require('../models/user.js')
const validateEditProfileData = require("../utils/validate.js");


profileRouter.get("/profile", authuser,(req,res)=>{
    try {
        const user = req.user;
        res.send(user);

        
    } catch (error) {
        res.send(error);
    }

});


profileRouter.patch("/update",authuser, async(req,res)=>{
    try {

        if(!validateEditProfileData(req)){
            return res.status(400).send("invalid edit request");
        }
        const user = req.user;
        Object.keys(req.body).forEach((key)=> (user[key] = req.body[key]) );
        await user.save();
        
    } catch (error) {
        res.send(error);
        
    }
});

profileRouter.get("/userInfo", async(req,res)=>{
    const email = req.body.emailId;
    const user = await User.find ({ email});
    res.send(user);

});

module.exports = profileRouter;