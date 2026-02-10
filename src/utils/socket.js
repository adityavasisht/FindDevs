const { Server } = require("socket.io");
const { Chat } = require("../models/chat"); 

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://www.finddevs.xyz", "https://finddevs.xyz"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {

      // 1. Create Room ID
      const roomId = [userId, targetUserId].sort().join("_");
      console.log("📩 Received Message:", text, "from", userId, "to", targetUserId);

      // 2. SAVE TO MONGODB
      try {
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (!chat) {
          console.log("⚠️ No existing chat found. Creating new one...");
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: userId,
          text: text,
          createdAt: new Date(),
        });

        await chat.save();
        console.log("✅ Message SAVED to Database!");

      } catch (err) {
        console.error("❌ DATABASE ERROR:", err);
      }

      // 3. Emit to Client (Real-time)
      io.to(roomId).emit("messageReceived", {
        firstName,
        lastName,
        text,
        senderId: userId,
        createdAt: new Date(),
      });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
