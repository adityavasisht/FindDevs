const mongoose = require('mongoose');
const connectDB  = async()=>{
 await mongoose.connect('mongodb+srv://aditya009:Helloaadi007@cluster0.xu7dt1v.mongodb.net/DevTinder');
};


module.exports = {
    connectDB
}