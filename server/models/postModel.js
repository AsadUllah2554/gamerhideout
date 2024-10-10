const User = require("./userModel");
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },

    title: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      // required:true
    },

    likes: [
      {
        userID: {
          type: String,
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        // You can add other fields related to the like if needed
      },
    ],

    comments: [CommentSchema],
  },
  { timestamps: true }
);

// Add indexing
PostSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Post", PostSchema);
