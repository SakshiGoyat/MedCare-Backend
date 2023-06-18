const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

module.exports = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  // console.log("all users route " + users);
  res.send(users);
});
