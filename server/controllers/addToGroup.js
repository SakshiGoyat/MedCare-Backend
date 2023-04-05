const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

module.exports = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  console.log("add to group")
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "password")
    .populate("groupAdmin", "password");

  if (!added) {
    res.status(400);
    throw new Error("Group not found");
  } else {
    res.json(added);
  }
});
