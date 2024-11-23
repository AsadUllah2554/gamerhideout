import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import { useUserContext } from "../../hooks/useUserContext";
import { useNavigate } from "react-router-dom";

const Post = ({ data }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [comments, setComments] = useState(data.comments);
  console.log("comments:", comments);
  const [editedDescription, setEditedDescription] = useState(data.description);
  const [comment, setComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const { user } = useUserContext();
  const [newUser, setNewUser] = useState();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    console.log("Image loaded");
    setImageLoaded(true); // Set image as loaded once it fully loads
  };

  const handleExpandComments = () => {
    setShowAllComments(true);
  };

  const handleEdit = async () => {
    const postId = data._id;
    console.log("Editing post:", postId);

    try {
      const response = await axios.patch(
        `${process.env.SERVER_URL}api/post/edit/${postId}`,
        {
          description: editedDescription,
          user,
        }
      );
      console.log(response.data);
      // Handle success, update UI, or close the editing mode
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
      // Handle error, show a message, etc.
    }
  };

  const handleDelete = async () => {
    try {
      const postId = data._id; // Assuming data contains the post information
      console.log("Deleting post:", postId);
      const response = await axios.delete(
        `${process.env.SERVER_URL}api/post/${postId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      console.log(response.data);
      // Handle success, update UI, or show a message
    } catch (error) {
      console.error("Error deleting post:", error);
      // Handle error, show a message, etc.
    }
  };

  console.log("comment :", comment);

  const handlePostComment = async () => {
    try {
      const response = await axios.post(
        `${process.env.SERVER_URL}/api/post/comment`,
        {
          postId: data._id,
          comment: comment,
          user,
        }
      );
      console.log(response.data); // Assuming the response contains the newly added comment
      setComment(""); // Clear the comment input field after submission
    } catch (error) {
      console.error("Error adding comment:", error);
      // Handle error, show a message, etc.
    }
  };
  const handleCommentClick = () => {
    setShowCommentBox(!showCommentBox);
  };
  const likePost = async () => {
    const postId = data._id;
    console.log("Toggling like for post:", postId);
    const username = user.username;
    const userID = user._id;

    try {
      let response;
      const isLiked = data.likes.some((like) => like.userID === userID);

      if (isLiked) {
        // If the post is already liked by the user, send a request to dislike the post
        response = await axios.patch(
          `${process.env.SERVER_URL}/api/post/dislike/${postId}`,
          {
            username,
            userID,
          }
        );
      } else {
        // If the post is not yet liked by the user, send a request to like the post
        response = await axios.patch(
          `${process.env.SERVER_URL}/api/post/like/${postId}`,
          {
            username,
            userID,
          }
        );
      }

      console.log(response.data); // Assuming the response contains the updated post information
      // You may update the UI or perform additional actions based on the response
    } catch (error) {
      console.error("Error toggling like:", error);
      // Handle error, show a message, etc.
    }
  };
  const handleUsernameClick = async () => {
    await axios
      .post(
        `${process.env.SERVER_URL}/auth/profile/findbyid`,
        { userID: data.user },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        console.log("found user", res.data.user);
        navigate(`/profile`, { state: { newUser: res.data.user } });
        setNewUser(res.data.user);
      })
      .catch((error) => {
        console.error("Axios Request Error:", error);
      });
  };

  return (
    <div className="Post">
      {!imageLoaded && <div className="image-skeleton" />}
      <img
        src={data.imageUrl}
        alt="Post"
        onLoad={handleImageLoad}
        loading="lazy"
        style={{ display: imageLoaded ? "block" : "none" }}
      />
      <div className="postReact">
        <img
          src={
            data.likes?.some((like) => like.userID === user._id)
              ? Heart
              : NotLike
          }
          alt="heart icon"
          className="hover"
          onClick={likePost}
        />
        <img
          src={Comment}
          alt="comment icon"
          className="hover"
          onClick={handleCommentClick}
        />
        <img src={Share} alt="share icon" className="hover" />
        <img
          src={Share}
          alt="new item"
          className="hover"
          style={{ marginLeft: "auto", cursor: "pointer" }}
          onClick={() => {
            setIsDropdownOpen(!isDropdownOpen);
            setIsEditing(false); // Close editing mode when opening dropdown
          }}
        />
        {isDropdownOpen && (
          <div className="dropdown">
            {user._id === data.user && isEditing ? (
              <Modal
                isOpen={isEditing}
                onRequestClose={() => setIsEditing(false)}
                contentLabel="Edit Post"
                style={{
                  content: {
                    height: "50%",
                    width: "50%",
                    top: "25%",
                    left: "25%",
                    textAlign: "center",
                  },
                }}
              >
                <h2>Add new description</h2>
                <button
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    fontSize: "18px",
                  }}
                  onClick={() => setIsEditing(false)}
                >
                  &times;
                </button>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  required
                />
                <div style={{ marginTop: "20px" }}>
                  <button
                    className="dropdown-option"
                    onClick={handleEdit}
                    style={{
                      background: "green",
                      width: "60px",
                      textAlign: "center",
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="dropdown-option"
                    onClick={() => setIsEditing(false)}
                    style={{
                      background: "red",
                      width: "60px",
                      textAlign: "center",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Modal>
            ) : (
              <>
                <button
                  className="dropdown-option"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button className="dropdown-option" onClick={handleDelete}>
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <span style={{ color: "var(--gray)", fontSize: "12px" }}>
        {data.likes?.length} likes
      </span>
      {showCommentBox && (
        <div className="commentBox">
          <textarea
            className="commentInput"
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="postButton" onClick={handlePostComment}>
            Post Comment
          </button>
        </div>
      )}
      <div className="detail">
        <span>
          <span onClick={handleUsernameClick} style={{ cursor: "pointer" }}>
            <b>{data.username}</b>
          </span>
        </span>
        <span> {editedDescription}</span>
        <span style={{ display: "block", fontSize: "12px" }}>
          {data.userRole?.charAt(0).toUpperCase() + data.userRole?.slice(1)}
        </span>
        {/* Comments UI */}
        <div className="comments-section">
          {showAllComments
            ? data.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <span className="comment-username">{comment.username}:</span>
                  <span className="comment-text">{comment.comment}</span>
                </div>
              ))
            : data.comments.slice(0, 2).map((comment, index) => (
                <div key={index} className="comment">
                  <span className="comment-username">{comment.username}:</span>
                  <span className="comment-text">{comment.comment}</span>
                </div>
              ))}

          {!showAllComments && data.comments.length > 2 && (
            <button className="expand-button" onClick={handleExpandComments}>
              Show all comments ({data.comments.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
