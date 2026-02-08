const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI is not defined. Please set it in your environment or in a .env file.");
    throw new Error("MONGODB_URI is not defined");
  }

  await mongoose.connect(uri);
};

module.exports = {
  connectDB,
};