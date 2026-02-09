const socket = require("socket.io");

const crypto = require("crypto");
const { Chat } = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {

      origin: ["http://localhost:3002",
        "http://16.171.12.116",
        "https://finddevs.xyz"
       ],
      methods: ["GET", "POST"],
      credentials: true
    },
  })
};

io.on("connection", (socket)=>{
    socket.on("joinChat", ({firstName, userId, targetUserId})=>{

        const roomId = [userId, targetUserId].sort().join(_);
        socket.join(roomId);

    });
    socket.on("sendMessage", async({firstName, lastName, userId, targetUserId, message})=>{

        const roomId = [userId, targetUserId].sort().join(_);


        try {
            let chat  = await Chat.findOne({
                participants: {$all: [userId, targetUserId]}

            });
            if(!chat){
                chat = new Chat({
                    participants: [userId, targetUserId],
                    messages: []
                });
            }

            chat.messages.push({
                senderId: userId,
                text: message
            });

            await chat.save();

            io.to(roomId).emit("messageReceived",{
                firstName,
                lastName,
                message,
                createdAt: new Date()
            });

            
        } catch (error) {
            console.log("error saving the chat" + error);
            
        }
    } )
});

  module.exports={
    initializeSocket
  }
