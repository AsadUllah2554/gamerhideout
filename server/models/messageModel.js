const mongoose = require("mongoose");


const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    senderName: {
      type: String,
    },
    text: {
      type: String,
    },
    file: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =  mongoose.model("Message", MessageSchema);

