const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const authuser = async (req, res, next) => {
  try {

    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please Login!");
    }


    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);


    const { userId } = decodedObj;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }


    req.user = user;
    next();

  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
};

module.exports = {
  authuser
};