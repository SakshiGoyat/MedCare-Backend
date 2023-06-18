const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

module.exports = asyncHandler(async (req, res) => {
  try {

    console.log("fetch chats route")
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users")
      .populate("groupAdmin")
      .populate("latestMessage")
      .sort({updatedAt: -1}).then(async(results) =>{
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name image email",
        });
        res.status(200).send(results);
      })
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});
