const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

module.exports = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserID param not sent with request");
    return res.status(400);
  }
  console.log("access chats ");
  // console.log(1);
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users")
    .populate("latestMessage");

  // console.log(2);

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name image email",
  });

  // console.log(3);

  if (isChat.length > 0) {
    console.log(isChat[0]);
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    console.log(4);

    try {
      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
      );

      console.log(5);
      console.log(fullChat);
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});
