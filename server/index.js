const express = require("express");

// rest object
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const color = require("colors");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

const { notFound, errorHandler } = require("./Middleware/errorMiddleware");
const { Server } = require("socket.io");
const connectDB = require("./db/conn");
app.use(require("./routes/auth"));
dotenv.config({ path: "./config.env" });

connectDB();
// port
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(morgan("dev"));

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(
    `Listening to ${process.env.NODE_MODE} Mode on port ${port}`.bgCyan.white
  );
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
