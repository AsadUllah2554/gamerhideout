const Post = require("../models/postModel");
const { uploadOnCloudinary } = require("../utils/cloudinary");

const successResponse = (res, data) => {
  res.status(200).json({ success: true, data });
};

const errorResponse = (res, errorMessage) => {
  res.status(500).json({ success: false, error: errorMessage });
};

const createPost = async (req, res) => {
  try {
    const postData = { ...req.body };
    console.log("postData " + JSON.stringify(postData, null, 2));
    if (req.file) {
      
      if (req.file) {
        // If the user already has a profile picture, delete the old one
      
        const imageResult = await uploadOnCloudinary(req.file.buffer);

        if (imageResult && imageResult.secure_url) {
          postData.imageUrl = imageResult.secure_url;
          console.log("postData.imageUrl" + postData.imageUrl);
        }
      }
    }
    const post = await Post.create(postData);
    console.log("post " + post); 
    // const newPost = await post.save();
    
    // console.log("post is: " + newPost);
    successResponse(res, post);
  } catch (error) {
    errorResponse(res, "Internal error occurred");
  }
};

const editPost = async (req, res) => {
  try {
    const postId = req.params.postId; // Assuming postId is part of the URL parameters

    const { description, user } = req.body;
    console.log("postId" + postId);
    console.log("user" + user);
    // Ensure that the user has a role
    if (user && user.role) {
      // Find the post by ID
      const existingPost = await Post.findById(postId);
      console.log("existingPost" + existingPost);
      // Check if the post exists
      if (!existingPost) {
        return errorResponse(res, "Post not found");
      }

      // Check if the post belongs to the user
      if (existingPost.user.toString() !== user._id) {
        return errorResponse(res, "User is not authorized to edit this post");
      }

      // Set the verified field based on the user's role
      const verified = true;
      console.log("verified" + verified);

      // Update the post based on the provided data
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          description,
          verified,
        },
        { new: true }
      );

      console.log(`Post with ID ${postId} has been successfully edited`);

      successResponse(res, updatedPost);
    } else {
      // If the user does not have the required role or the role is not provided
      errorResponse(res, "Invalid user role");
    }
  } catch (error) {
    console.error("Error editing post:", error);
    errorResponse(res, "Internal error occurred");
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    successResponse(res, posts);
  } catch (error) {
    errorResponse(res, "Internal error occurred");
  }
};

const getPost = async (req, res) => {
  try {
    const mypost = await Post.find({ user: req.params.id });
    if (!mypost || mypost.length === 0) {
      return res.status(200).json("You don't have any post");
    }
    successResponse(res, mypost);
  } catch (error) {
    errorResponse(res, "Internal server error");
  }
};

const updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json("Post not found");
    }

    post = await Post.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    let updatepost = await post.save();
    successResponse(res, updatepost);
  } catch (error) {
    errorResponse(res, "Internal error occurred");
  }
};

const likePost = async (req, res) => {
  const postId = req.params.postId;
  const { username, userID } = req.body;
  console.log("postId" + postId);
  console.log("username" + username);
  try {
    // Find the post by its ID
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if the user has already liked the post
    const existingLike = post.likes.find((like) => like.userID === userID);
    if (existingLike) {
      throw new Error("Post already liked by the user");
    }

    // Add the like to the post
    post.likes.push({ userID, username });

    // Save the updated post
    await post.save();
    return post;
  } catch (error) {
    throw new Error(`Error liking post: ${error.message}`);
  }
};

const dislikePost = async (req, res) => {
  const postId = req.params.postId;
  const { username, userID } = req.body;

  try {
    // Find the post by its ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already liked the post
    const existingLikeIndex = post.likes.findIndex(
      (like) => like.userID === userID
    );
    if (existingLikeIndex === -1) {
      return res.status(400).json({ message: "Post is not liked by the user" });
    }

    // Remove the like from the post
    post.likes.splice(existingLikeIndex, 1);

    // Save the updated post
    await post.save();

    return res
      .status(200)
      .json({ message: "Post disliked successfully", post });
  } catch (error) {
    console.error("Error disliking post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const commentPost = async (req, res) => {
  try {
    const { comment, postId, user } = req.body;
    const comments = {
      user: user._id,
      username: user.username,
      comment,
      profilePicture: user.profilePicture,
    };
    const post = await Post.findById(postId);
    if (!post) {
      return errorResponse(res, "Post not found");
    }
    post.comments.push(comments);
    await post.save();
    successResponse(res, post);
  } catch (error) {
    errorResponse(res, "Internal server error");
  }
};

const deletePost = async (req, res) => {
  try {
    console.log("request data", req);
    console.log("user data", req.sessionStore.sessions);
    const post = await Post.findById(req.params.id);
    console.log("post is", post);
    if (!post) {
      return errorResponse(res, "Post not found");
    }
    if (post.user.toString() === req.passport.id) {
      const deletedPost = await Post.findByIdAndDelete(post);
      successResponse(res, "Your post has been deleted");
    } else {
      errorResponse(res, "You are not allowed to delete this post");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    errorResponse(res, "Internal server error");
  }
};

const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      (comment) => comment.id === req.params.commentid
    );
    if (comment.user.toString() === req.user.id) {
      await post.updateOne({
        $pull: { comments: { _id: req.params.commentid } },
      });
      successResponse(res, "Your comment has been deleted");
    } else {
      errorResponse(res, "You are not allowed to delete this comment");
    }
  } catch (error) {
    errorResponse(res, "Internal server error");
  }
};

module.exports = {
  createPost,
  editPost,
  getPost,
  getPosts,
  updatePost,
  likePost,
  dislikePost,
  commentPost,
  deletePost,
  deleteComment,
};
