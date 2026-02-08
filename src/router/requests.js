const express = require('express');
const {authuser} = require("../middlewares/auth.js");
const reqRouter = express.Router();
const connectionReq = require("../models/connectionreq.js");

reqRouter.post("/request/send/:status/:toUserId",authuser, async(req,res)=>{
    try {

        
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const ALLOWED_STATUS = ["interested","ignore"];
    if(!ALLOWED_STATUS.includes(status)){
        return res.status(400).send("status is not valid");
    }
    if (fromUserId.toString() === toUserId.toString()) {
        return res.status(400).send("You cant send req to yourself");
    }
    const checkReqValidity = await connectionReq.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId, toUserId:fromUserId},
        ],
    });
    if(checkReqValidity){
        return res.status(400).send("You can't re send them request/ They have already sent u a req");
    }

    const connectionRequest = new connectionReq({
        fromUserId,
        toUserId,
        status
    });
    const reqData  = await connectionRequest.save();
    res.json({
        message: "connection request sent",
        reqData,
    });
        
    } catch (error) {
        res.send(error);
        
    }

});

reqRouter.post("/request/review/:status/:requestId",authuser, async(req,res)=>{
    try {
        const loggedinUser = req.user;
        const { status, requestId } = req.params;

        const ALLOWED_STATUS = ["accepted","rejected"];
        if (!ALLOWED_STATUS.includes(status)) {
            return res.status(400).send("Invalid Status.");
        }
        const connectionRequest = await connectionReq.findOne({
            _id: requestId,
            toUserId: loggedinUser._id,
            status: "interested",
        });
        if(!connectionRequest){
            return res.status(400).send("Invalid connection request");
        }
        connectionRequest.status = status;
        const connectionReqResponse = await connectionRequest.save();
        res.status(200).send(`connection req ${status} successfully`); 



        
    } catch (error) {
        res.status(400).send(error);
        
    }
})

module.exports = reqRouter;