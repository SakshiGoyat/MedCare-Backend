const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");


module.exports = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request.");
    return res.status(400);
  }
  console.log("send message.")
  // console.log(1);
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    // console.log(2);
    message = await message.populate("sender", "name image");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name image email",
    });

    // console.log(3);

    await Chat.findByIdAndUpdate(req.body.chatId, {
      $set: {
        latestMessage: message,
      },
    });
    // console.log(message);
    res.json(message);
  } catch (error) {
    res.status(400);

    throw new Error(error);
  }
});
