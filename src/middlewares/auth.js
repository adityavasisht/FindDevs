const jwt = require("jsonwebtoken");
const User = require("../models/user.js");


const authuser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("token missing");
    }

    const decodedObj = jwt.verify(token, "secretkey99");

    const user = await User.findOne({ _id: decodedObj.userId });
    if (!user) {
      return res.status(401).send("user not authorized");
    }

    req.user = user;
    next();

  } catch (error) {
    res.status(401).send("invalid token");
  }
};

module.exports = {
  authuser
};
