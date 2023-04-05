const asyncHandler = require("express-async-handler");
const Evalidator = require("email-validator");
const User = require("../models/userModel");
const generateToken = require("../authentication/authenticate");

module.exports = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const image = req.body.imageUrl;

  // console.log(req.body);
  
  if (!Evalidator.validate(email)) {
    res.status(400).json({ error: "Credentials' validation error e." });
  }
  // console.log(1);
  const userExists = await User.findOne({ email: email });

  // console.log(2);
  if (userExists) {
    res.status(400);
    throw new Error("User already exists.");
  }

  console.log(3);
  const user = await User.create({
    name,
    email,
    password,
    image,
  });

  // const getUser = await User.findOne({email:email});

  // console.log(getUser);
  // console.log(user.name);
  // console.log(4);
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      image: user.image,
      token: generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("User is not registered.");
  }
});
