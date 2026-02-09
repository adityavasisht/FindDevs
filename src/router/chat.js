const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth"); 
const chatRouter = express.Router();


chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName photoUrl", 
    });

    if (!chat) {

      return res.json({ messages: [] });
    }

    res.json({ messages: chat.messages });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching chat history");
  }
});

module.exports = chatRouter;