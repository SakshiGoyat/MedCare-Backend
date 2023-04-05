const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");

module.exports = expressAsyncHandler(async (req, res) => {
  try {
    console.log("all messages.")
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name image email")
      .populate("chat");

    // console.log(messages);
    res.json(messages);
  } catch (error) {
    res.status(400);

    throw new Error(error);
  }
});
