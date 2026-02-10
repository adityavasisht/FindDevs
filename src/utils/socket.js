const socket = require("socket.io");
const { Chat } = require("../models/chat");

const initializeSocket = (server) => {

  const io = socket(server, {
    cors: {
      origin: [
        "http://localhost:3002",
        "http://localhost:5173",
        "https://finddevs.xyz",
        "https://www.finddevs.xyz",
        "http://16.171.12.116"
      ],
      methods: ["GET", "POST"],
      credentials: true
    },
  });



  io.on("connection", (socket) => {
    console.log("User Connected: " + socket.id);

    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {

      const roomId = [userId, targetUserId].sort().join("_"); 
      socket.join(roomId);
      console.log(firstName + " joined " + roomId);
    });

    socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {

      const roomId = [userId, targetUserId].sort().join("_");

      try {
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] }
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: []
          });
        }

        chat.messages.push({
          senderId: userId,
          text: text, 
        });

        await chat.save();

        io.to(roomId).emit("messageReceived", {
          firstName,
          lastName,
          text,
          createdAt: new Date(),
        });

      } catch (error) {
        console.log("Error saving chat: " + error);
      }
    });
    
    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });
  });
};


module.exports = initializeSocket;
