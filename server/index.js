const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
// const http = require("http");
// var server = http.createServer(app);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

require("./db/conn");
const { notFound, errorHandler } = require("./Middleware/errorMiddleware");
const { Server } = require("socket.io");
app.use(require("./routes/auth"));
dotenv.config({ path: "./config.env" });
const port = process.env.PORT;

app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API is running.");
});

// app.get("/api/chat", (req, res) => {
//   res.send(chats);
// });

// app.get("/api/chat/:id", (req,res)=>{
//     // console.log(req.params.id);
//      const singleChat = chats.find((c)=> c._id === req.params.id);
//      res.send(singleChat);
// });

// app.use("/api/user", userRoutes);

const server = app.listen(port, () => {
  console.log(`Listening to ${port} port`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log("user data ", userData);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
