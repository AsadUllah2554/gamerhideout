const Message = require("../models/messageModel.js");


const sendMessage = async (req, res) => {
  const { chatId, senderId, senderName, text,file } = req.body;

  try {
    const message = new Message({
      chatId,
      senderId,
      senderName,
      text,
      file
    });

    const result = await message.save();
    io.to(chatId).emit("message", result);

    res.status(201).json({ message: "Message sent successfully", data: result });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await Message.find({ chatId });
    res.status(200).json(result);
   
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { sendMessage, getMessages };