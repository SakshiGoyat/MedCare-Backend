const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");

module.exports = expressAsyncHandler(async (req, res) => {
  try {
    const user =  await User.findById({ _id: req.body.userId });
    const seenNotification = user.seenNotification;
    const notification = user.notification;
    seenNotification.push(...notification);
    user.notification = [];
    user.seenNotification = notification;

    const updatedUser = await user.save();

    res.status(200).send({
      success: true,
      message: "all notifications are marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .send({ message: "Error in notification.", success: false, error });
  }
});
