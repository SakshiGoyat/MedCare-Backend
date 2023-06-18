const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");

// controllers

//users
const registerUser = require("../controllers/registerUser");
const authUser = require("../controllers/authUser");
const allUsers = require("../controllers/allUsers");

// chats
const accessChat = require("../controllers/accessChat");
const fetchChats = require("../controllers/fetchChats");
const createGroupChat = require("../controllers/createGroupChat");
const renameGroup = require("../controllers/renameGroup");
const addToGroup = require("../controllers/addToGroup");
const removeFromGroup = require("../controllers/removeFromGroup");

//messages
const sendMessage = require("../controllers/sendMessage");
const allMessages = require("../controllers/allMessages");

// apply doctor
const applyDoctor = require("../controllers/applyDoctor");

// get all notifications
const getAllNotifications = require("../controllers/getAllNotifications");

// delete all notifications
const deleteAllNotification = require("../controllers/deleteAllNotification");

const { getAllUsersController, getAllDoctorsController,changeAccountStatus } = require("../controllers/adminCtrl");
//changing data
router.use(express.json());

// user routes
router.route("/api/user/").post(registerUser);
router.route("/api/user/login").post(authUser);
router.route("/api/user/").get(protect, allUsers); // it used to search.

// chat routes
router.route("/api/chat/").post(protect, accessChat);
router.route("/api/chat/").get(protect, fetchChats);
router.route("/api/chat/group").post(protect, createGroupChat);
router.route("/api/chat/rename").patch(protect, renameGroup);
router.route("/api/chat/groupremove").patch(protect, removeFromGroup);
router.route("/api/chat/groupadd").patch(protect, addToGroup);

// message routes
router.route("/api/message/").post(protect, sendMessage);
router.route("/api/message/:chatId").get(protect, allMessages);

// apply-doctor
router.route("/api/apply-doctor").post(protect, applyDoctor);
module.exports = router;

// get all notifications
router.route("/api/get-all-notification").post(protect, getAllNotifications);

//delete all notifications
router.route("/api/delete-all-notification").post(protect, deleteAllNotification);

// admin routes (users)
router.route("/api/getAllUsers").get(getAllUsersController);

// admin routes (doctors)
router.route("/api/getAllDoctors").get(getAllDoctorsController);

// admin change account status
router.route("/api/changeAccountStatus").post(changeAccountStatus);