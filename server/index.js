const express = require("express");
// const cookieSession = require("cookie-session");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
// const session = require("express-session");
const messageRoutes = require("./routes/message");
const chatRoutes = require("./routes/chat");
const socketIo = require("socket.io");
const Message = require("./models/messageModel");

require("dotenv").config();
const app = express();
// const server = require("http").createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// }); // Attach Socket.IO to the HTTP server


const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.4:19000",
  "http://localhost:3000",
  "https://uolsocialmedia.netlify.app",
  "http://localhost:19006",
  "http://192.168.1.4:19000",
];

// Middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

// app.set("trust proxy", 1);

// app.use(
//   session({
//     secret: "uol",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 },
//   })
// );

// This code is used when u deploy on different server...
// When deploying on heroku use this
// app.use(session({ secret: 'uol', resave: false,
// saveUninitialized: true,
// cookie:{
//   sameSite: 'none',
//   secure: true,
//   maxAge: 1000 * 60 * 60 * 24 * 7 // One Week

// } }));
// app.use(
//   cookieSession({ name: "session", keys: ["uol"], maxAge: 24 * 60 * 60 * 100 })
// );

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
app.get("/", (req, res) => {
  // how to return a static json responce for testing
  res.json({ message: "Welcome!!!" });
});

app.get("/user", (req, res) => {
  // how to return a static json responce for testing
  res.json({ message: "test" });
});

app.use("/auth", authRoutes);
app.use("/api", postRoutes);
app.use("/api/chat", chatRoutes);

// Messages routes with functions

// Socket.IO event handling

// let activeUsers = [];

// io.on("connection", (socket) => {
//   console.log("Server connected to a client.");

//   socket.on("new-user-add", (newUserId) => {
//     if (!activeUsers.some((user) => user.userId === newUserId)) {
//       activeUsers.push({ userId: newUserId, socketId: socket.id });
//       console.log("New User Connected", activeUsers);
//     }
//     io.emit("get-users", activeUsers);
//   });
//   socket.on("join-chat", (chatId) => {
//     socket.join(chatId);
//     console.log(`User joined chat room: ${chatId}`);
//   });

//   socket.on("leave-chat", (chatId) => {
//     socket.leave(chatId);
//     console.log(`User left chat room: ${chatId}`);
//   });

//   socket.on("disconnect", () => {
//     activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
//     console.log("User Disconnected", activeUsers);
//     io.emit("get-users", activeUsers);
//   });

//   socket.on("send-message", (data) => {
//     console.log("Data of send message:", data);
//     console.log("Active Users:", activeUsers);
//     const { chatId } = data;
//     const { receiverId } = data;

//     // const user = activeUsers.find((user) => user.userId === receiverId.user._id);
//     // console.log("User of send message:", user)
//     console.log("Sending from socket to :", receiverId);
//     console.log("Data: ", data);
//     io.to(chatId).emit("receive-message", data);
//     // if (user) {
//     //   io.to(data.chatId).emit("receive-message", data)
//     //   console.log("Message emitted from receive-message :", data); // Log emitted message

//     // }
//   });
// });

// // Messages functionality

// // Send message functionality
// const sendMessage = async (req, res) => {
//   const { chatId, senderId, text } = req.body;
//   console.log("ChatId: ", chatId);

//   try {
//     // Create a new message document
//     const message = new Message({
//       chatId,
//       senderId,
//       text,
//     });

//     // Save the message to the database
//     const result = await message.save();

//     // Emit the message to all members of the chat group via Socket.io
//     console.log("Emitting message to chatId: ", chatId, result);
//     io.to(chatId).emit("message", result);

//     res
//       .status(201)
//       .json({ message: "Message sent successfully", data: result });
//   } catch (error) {
//     console.error("Error sending message:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Get messages functionality
// const getMessages = async (req, res) => {
//   const { chatId } = req.params;
//   try {
//     const result = await Message.find({ chatId });
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// app.post("/api/message/send", sendMessage);
// app.get("/api/messages/:chatId", getMessages);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("connected to data server started at !!!", PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
