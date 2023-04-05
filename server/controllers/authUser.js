const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../authentication/authenticate");
const asyncHandler = require("express-async-handler");

module.exports = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(200).json({ error: "Please fill all the fields properly l." });
  }

  console.log("auth user")
  const user = await User.findOne({ email });

  if (user && bcrypt.compare(password, user.password)) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      image: user.image,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ error: "Try again" });
  }
});
