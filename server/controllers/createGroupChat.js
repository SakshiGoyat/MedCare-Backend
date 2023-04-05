const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

module.exports = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields." });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat.");
  }

  console.log("create grp chat.");
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGrouptChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "password")
      .populate("groupAdmin", "password");

    res.status(200).json(fullGrouptChat);
  } catch (err) {
    res.status(400);

    throw new Error(err.message);
  }
});
