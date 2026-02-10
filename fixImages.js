const mongoose = require("mongoose");
const User = require("./src/models/user"); // Path to your User model
require("dotenv").config(); // Load environment variables

const fixImages = async () => {
  try {
    // 1. Connect to Database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    // 2. The default placeholder image
    const DEFAULT_IMAGE = "https://geeks-of-code.s3.ap-south-1.amazonaws.com/dev-tinder-placeholder.jpg";

    // 3. Update all users with "localhost" in their photoUrl
    const result = await User.updateMany(
      { photoUrl: { $regex: "localhost" } }, 
      { $set: { photoUrl: DEFAULT_IMAGE } }
    );

    console.log(`✅ Success! Updated ${result.modifiedCount} users.`);

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    // 4. Close connection
    await mongoose.connection.close();
    console.log("Done.");
  }
};

fixImages();
