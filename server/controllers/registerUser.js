const asyncHandler = require("express-async-handler");
const Evalidator = require("email-validator");
const User = require("../models/userModel");
const generateToken = require("../authentication/authenticate");
const bcrypt = require("bcryptjs");

module.exports = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const image = req.body.imageUrl;

    if (!Evalidator.validate(email)) {
      res
        .status(200)
        .send({ message: "Credentials' validation error.", success: false });
    }
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      res.status(200).send({ message: "user already exist.", success: false });
    }

    const user = await User.create({
      name,
      email,
      password,
      image,
    });

    
    if (user) {
      res.status(201).send({
        message: {
          _id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          image: user.image,
          isAdmin: user.isAdmin,
          isSystemAdmin: user.isSystemAdmin,
          isDoctor: user.isDoctor,
          token: generateToken(user._id),
          notification: user.notification,
          seenNotification: user.seenNotification,
        },
        success: true,
      });
    } else {
      res
        .status(200)
        .send({ message: "User is not registered.", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(200).send({
      success: false,
      message: `register controller error ${error.message}`,
    });
  }
});
