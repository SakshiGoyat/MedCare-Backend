const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

module.exports = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "password")
    .populate("groupAdmin", "password");

  if (!updatedChat) {
    res.status(400);

    throw new Error("Group not Found");
  } else {
    res.json(updatedChat);
  }
});
