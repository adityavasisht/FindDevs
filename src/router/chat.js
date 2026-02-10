const express = require("express");
const { Chat } = require("../models/chat"); 
const { authuser } = require("../middlewares/auth");

// Import the User model so we can pass it explicitly
const User = require("../models/user"); 

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", authuser, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    // 1. Find the chat
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      model: "userModel", // FIX: Explicitly tell Mongoose to look for 'userModel'
      select: "firstname lastname photoUrl", // FIX: Use lowercase fields (matches your DB)
    });

    if (!chat) {
      return res.json({ messages: [] });
    }

    // 2. Map the messages to match Frontend expectations
    // Frontend expects: { firstName: "...", text: "..." }
    // Database gives:   { senderId: { firstname: "..." }, text: "..." }
    const formattedMessages = chat.messages.map((msg) => {
        const sender = msg.senderId; 
        return {
            _id: msg._id,
            text: msg.text,
            senderId: sender._id,
            createdAt: msg.createdAt,
            // Map 'firstname' (DB) to 'firstName' (Frontend)
            firstName: sender ? sender.firstname : "Unknown",
            lastName: sender ? sender.lastname : "User",
            photoUrl: sender ? sender.photoUrl : ""
        };
    });

    res.json({ messages: formattedMessages });

  } catch (err) {
    console.error("CHAT ROUTER ERROR:", err);
    res.status(500).send("Error fetching chat: " + err.message);
  }
});

module.exports = chatRouter;
