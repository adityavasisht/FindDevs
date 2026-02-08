require('dotenv').config();

const express = require('express');
const cors = require('cors'); // 1. Import cors
const app = express();
const { connectDB } = require("./config/database");
const cookieparser = require('cookie-parser');

const authRouter = require("./router/auth.js");
const profileRouter = require("./router/profile.js");
const reqRouter = require("./router/requests.js");
const { userRouter } = require('./router/user.js');
const { razorpayRouter } = require('./router/razorpay.js');

// 2. Configure CORS before your routes
app.use(cors({
  origin: "http://localhost:3002", // Your frontend URL
  credentials: true,                // Allows cookies to be sent back and forth
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieparser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", reqRouter);
app.use("/", userRouter);
app.use("/", razorpayRouter);

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("server running on the port 3000...");
    });
    console.log("connected to cluster");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err.message);
    process.exit(1);
  });