const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    groupName: {
      type: String, // Group name
      required: true,
    },
    semester: {
      type: String, // Semester of the group
      required: true,
    },
    section: {
      type: String, // Section of the group
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId, // ID of the creator (CR)
      ref: "User", // Reference to the User model
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId, // ID of the teacher
      ref: "User", // Reference to the User model
    },
    members: [{
      user: {
        type: mongoose.Schema.Types.ObjectId, // ID of the member
        ref: "User", // Reference to the User model
      },
      status: {
        type: String, // Status of the member (e.g., "pending", "accepted")
        default: "pending",
      },
    }],
  },
  {
    timestamps: true,
  }
);


module.exports =  mongoose.model("ChatModel", ChatSchema);
