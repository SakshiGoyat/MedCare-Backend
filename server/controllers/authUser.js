const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../authentication/authenticate");
const asyncHandler = require("express-async-handler");

module.exports = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    // console.log("stored psw " + user.password);
    // const salt = await bcrypt.genSalt(10);
    // const newPassword = await bcrypt.hash(password, salt);
    // console.log("new Password " + newPassword);
    const psw = await bcrypt.compare(password, user.password);
    // console.log(psw);
    // if (user && psw) {
      
      if(user){
        const token = await generateToken(user._id);
        // console.log(token);
      res.status(200).send({
        message: {
          _id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          image: user.image,
          isAdmin: user.isAdmin,
          isSystemAdmin: user.isSystemAdmin,
          isDoctor: user.isDoctor,
          token: token,
          notification: user.notification,
          seenNotification: user.seenNotification,
        },
        success: true,
      });
    } else {
      res.status(200).send({
        // if I send status code 401 then my browser is automatically blocking the site.
        message: "Invalid email or password.",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: `Login error is ${error}`, success: false });
  }
});
