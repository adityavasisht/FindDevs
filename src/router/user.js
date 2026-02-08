const express = require('express');
const { authuser } = require('../middlewares/auth');
const connectionReq = require('../models/connectionreq');
const userModel = require('../models/user');
const userRouter = express.Router();

const SAFE_DATA = "firstname lastname gender photoUrl about bio skills";

userRouter.get("/user/requests/recieved",authuser, async(req,res)=>{
    try {
        const loggedinUser = req.user;

        const connectionRequests = await connectionReq.find({
            toUserId: loggedinUser._id,
            status: "interested",
        }).populate("fromUserId", SAFE_DATA);
        res.send(connectionRequests);


        
    } catch (error) {
        res.status(400).send(error);
    }

});
userRouter.get("/user/connections", authuser, async(req,res)=>{
    try {
        const loggedinUser = req.user;
        const connectionRequests = await connectionReq.find({
            $or:[
                {fromUserId : loggedinUser._id, status: "accepted"},
                {toUserId: loggedinUser._id, status: "accepted"},
            ]
        }).populate("fromUserId", SAFE_DATA).populate("toUserId", SAFE_DATA);
        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedinUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId});
        res.send(data);
        
    } catch (error) {
        res.status(400).send(error);
    }
})

userRouter.get("/feed", authuser, async (req,res)=>{
    try {
        const loggedinUser = req.user;

        const page = parseInt(req.query.page)|| 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page-1)*limit;

        const connectionRequests = await connectionReq.find({
            $or :[
                {fromUserId: loggedinUser._id},
                {toUserId: loggedinUser._id}
                
            ]
        }).select("fromUserId toUserId");

        const hiddenfromfeed = new Set();

        connectionRequests.forEach((req)=>{
            hiddenfromfeed.add(req.fromUserId.toString());
            hiddenfromfeed.add(req.toUserId.toString());
        });

        const users = await userModel.find({
          $and :[
            { _id: { $nin: Array.from(hiddenfromfeed) } },
            { _id: { $ne: loggedinUser._id } }
          ]
        }).select(SAFE_DATA).skip(skip).limit(limit);
        res.send(users);


        
    } catch (error) {
        res.status(404).send(error);
    }
})

module.exports = {

    userRouter
}