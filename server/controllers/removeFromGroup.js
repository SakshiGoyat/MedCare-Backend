const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

module.exports = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "password")
    .populate("groupAdmin", "password");

  if (!removed) {
    res.status(400);
    throw new Error("Group not found");
  } else {
    res.json(removed);
  }
});
