const express = require('express');
const app = express();
const { connectDB} = require("./config/database");
const cookieparser = require('cookie-parser');
const authRouter = require("./router/auth.js")
const profileRouter = require("./router/profile.js");
const reqRouter = require("./router/requests.js");
const { userRouter } = require('./router/user.js');



app.use(express.json());
app.use(cookieparser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", reqRouter);
app.use("/", userRouter);




connectDB().then(()=>{
    app.listen(3000,()=>{
    console.log("server running on the port 3000...");
})
    console.log("connected to cluster");
})
