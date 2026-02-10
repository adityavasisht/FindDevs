require('dotenv').config();

const express = require('express');
const cors = require('cors'); 
const app = express();
const { connectDB } = require("./config/database");
const cookieparser = require('cookie-parser');

const http = require("http");
const initializeSocket = require("./utils/socket.js");
const server = http.createServer(app);
initializeSocket(server);



const authRouter = require("./router/auth.js");
const profileRouter = require("./router/profile.js");
const reqRouter = require("./router/requests.js");
const { userRouter } = require('./router/user.js');
const { razorpayRouter } = require('./router/razorpay.js');
const chatRouter = require('./router/chat.js');


app.use(cors({
  origin: ["http://localhost:5173",
           "http://localhost:3002",
           "https://finddevs.xyz",
           "https://www.finddevs.xyz",],
  credentials: true,                
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieparser());

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", reqRouter);
app.use("/api", userRouter);
app.use("/api", razorpayRouter);
app.use("/api", chatRouter);

connectDB()
  .then(() => {
    server.listen(3000, () => {
      console.log("server running on the port 3000...");
    });
    console.log("connected to cluster");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err.message);
    process.exit(1);
  });
