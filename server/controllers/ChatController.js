const ChatModel = require("../models/chatModel");
const User = require("../models/userModel");
const validator = require('validator');


 const createGroupChat = async (req, res) => {
  console.log("Creating group chat")
  try {
    const { groupName, semester, section, creatorId } = req.body;
    // Check if the creator exists
    const creator = await User.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }
    // Create the chat
    const groupchat = new ChatModel({
      creatorId,
      groupName,
      semester,
      section,
      members: [{ user: creatorId, status: "accepted" }], // Add the creator as a member
    });

    // Save the chat to the database
    await groupchat.save();

    res.status(201).json({ message: "Group chat created successfully", groupchat });
  } catch (error) {
    console.error("Error creating group chat:", error);
    res.status(500).json({ message: "Internal server error" })
  }
};

const fetchUserGroups = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming userId is passed in the URL params

    // Find all the groups where the user is a member
    const userGroups = await ChatModel.find({ "members.user": userId, "members.status": "accepted"  })
      .populate("creatorId")
      .populate("teacher")
      .populate("members.user");
  
    res.status(200).json({ userGroups })
  } catch (error) {
    console.error("Error fetching user groups:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createGroupInvitation = async (req, res) => {
  console.log("Creating group invitation")
  try {
    const { chatId, userEmail } = req.body
    // Validate the email address
    if (!validator.isEmail(userEmail)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check if the user with the provided email exists
    const invitedUser = await User.findOne({ email: userEmail });
    if (!invitedUser) {
      return res.status(404).json({ message: "User not found with the provided email address" });
    }

    // Check if the invited user has an admin role
    if (invitedUser.role === "admin") {
      return res.status(400).json({ message: "Admins cannot be added to chat groups" });
    }

    // Retrieve the chat group
    const chatGroup = await ChatModel.findById(chatId);
    if (!chatGroup) {
      return res.status(404).json({ message: "Chat group not found" });
    }

    // Check if the user is already a member of the chat group
    const isMember = chatGroup.members.some(member => member.user.equals(invitedUser._id));
    if (isMember) {
      return res.status(400).json({ message: "User is already a member of the chat group" });
    }


    // Add the invited user as a member of the chat group
    chatGroup.members.push({ user: invitedUser._id, status: "pending" });

    // Save the updated chat group document
    await chatGroup.save();

    res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error("Error sending group invitation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPendingInvitations = async (req, res) => {
  try {
    const { userId } = req.params;
    // Find all the group chats where the user is a member with status "pending"
    const pendingInvitations = await ChatModel.find({ "members.user": userId, "members.status": "pending" });
    res.status(200).json({ pendingInvitations });
  } catch (error) {
    console.error("Error fetching pending invitations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const acceptInvitation = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    // Find the chat by ID
    const chat = await ChatModel.findById(chatId)
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" })
    }
    // Update the status of the user in the chat to "accepted"
    const member = chat.members.find(member => member.user == userId)
    if (member) {
      member.status = "accepted";
      await chat.save();
      res.status(200).json({ message: "Invitation accepted successfully" });
    } else {
      res.status(404).json({ message: "User not found in the chat" });
    }
  } catch (error) {
    console.error("Error accepting invitation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


 const createChat = async (req, res) => {
  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

 const userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

 const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error)
  }
};

module.exports = {createGroupChat,
  fetchUserGroups,
  createGroupInvitation, 
  getPendingInvitations,
  acceptInvitation,
  createChat, 
  findChat, 
  userChats };