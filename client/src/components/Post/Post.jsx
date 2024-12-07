import React, { useContext, useState } from "react";
import axios from "axios";
import "./Post.css";
import { useUserContext } from "../../hooks/useUserContext";
import { useNavigate } from "react-router-dom";
import { formatTimeAgo } from "../../utils/utils";
import { Avatar, Button, Card, Input, message, Modal } from "antd";
import {
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
  LikeFilled,
} from "@ant-design/icons";
import { defaultProfileImage } from "../../common/common";
import { PostContext } from "../../context/postContext";

const Post = ({ post }) => {
  const { posts, setPosts } = useContext(PostContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [comments, setComments] = useState(post.comments);

  const [editedDescription, setEditedDescription] = useState(post.description);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUserContext();
  const navigate = useNavigate();

  const isLikedByUser = post.likes.some((like) => like.userID === user._id);
  const initialCommentsToShow = 2;
  const commentsToDisplay = showAllComments
    ? post.comments
    : post.comments.slice(0, initialCommentsToShow);
  const [commentText, setCommentText] = useState("");

  const handleOpenComments = (post) => {
    setSelectedPost(post);
  };

  const handleAddComment = () => {
    if (commentText.trim() && selectedPost) {
      // In a real app, this would be a backend call
      const updatedPosts = posts.map((post) =>
        post.id === selectedPost.id
          ? { ...post, comments: post.comments + 1 }
          : post
      );
      setPosts(updatedPosts);
      setCommentText("");
    }
  };

  const handleExpandComments = () => {
    setShowAllComments(true);
  };

  const handleEdit = async () => {
    const postId = data._id;
 

    try {
      const response = await axios.patch(
        `${process.env.SERVER_URL}api/post/edit/${postId}`,
        {
          description: editedDescription,
          user,
        }
      );
  

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const postId = data._id; // Assuming data contains the post information
     
      const response = await axios.delete(
        `${process.env.SERVER_URL}api/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
   
      // Handle success, update UI, or show a message
    } catch (error) {
      console.error("Error deleting post:", error);
      // Handle error, show a message, etc.
    }
  };



  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.SERVER_URL}api/post/comment`,

        {
          postId: post._id,
          comment: commentText,
          user,
          imageUrl: user.profilePicture,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === response.data.data._id ? response.data.data : post
        )
      );

      setLoading(false);
      setCommentText("");
      setSelectedPost(null);
    } catch (error) {
      setLoading(false);
      console.error("Error adding comment:", error);
      message.error("Error adding comment:", error);
      // Handle error, show a message, etc.
    } finally {
      setLoading(false);
    }
  };

  const likePost = async () => {
    const postId = post._id;

    const username = user.username;
    const userID = user._id;

    try {
      const updatedPosts = posts.map((p) => {
        if (p._id === postId) {
          const isCurrentlyLiked = p.likes.some(
            (like) => like.userID === userID
          );

          return {
            ...p,
            likes: isCurrentlyLiked
              ? p.likes.filter((like) => like.userID !== userID)
              : [...p.likes, { username, userID }],
          };
        }
        return p;
      });

      setPosts(updatedPosts);
      const endpoint = isLikedByUser
        ? `${process.env.SERVER_URL}api/post/dislike/${postId}`
        : `${process.env.SERVER_URL}api/post/like/${postId}`;

      await axios.patch(
        endpoint,
        {
          username,
          userID,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error toggling like:", error);
      setPosts(posts);
    }
  };
  const handleUsernameClick = async () => {

    navigate(`/profile/${post.user._id}`);
  };

  return (
    <>
      <Card key={post._id} className="mb-4">
        <div className="flex items-center mb-4">
          <Avatar
            src={post.user.profilePicture || defaultProfileImage}
            className="mr-4 cursor-pointer"
            onClick={handleUsernameClick}
          />
          <div>
            <h3
              className="font-bold cursor-pointer"
              onClick={handleUsernameClick}
            >
              {post.user.name}
            </h3>
            <p className="text-gray-500 text-sm">
              {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        <p className="mb-4">{post.description}</p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post"
            className="w-full rounded-lg mb-4 object-cover max-h-96"
          />
        )}
        <div className="flex justify-between text-gray-600">
          <div
            className="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={likePost}
          >
            {isLikedByUser ? (
              <LikeFilled className="text-blue-600" />
            ) : (
              <LikeOutlined />
            )}
            <span>{  post.likes.length }</span>
          </div>
          <div
            className="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleOpenComments(post)}
          >
            <CommentOutlined />
            <span>{post.comments > 0 && post.comments}</span>
          </div>
          <ShareAltOutlined className="cursor-pointer hover:text-blue-600 transition-colors" />
        </div>
        {/* Comments Preview */}
        {post.comments.length > 0 && (
          <div className="mt-4 border-t pt-2">
            {commentsToDisplay.map((comment, index) => (
              <div key={index} className="mb-2">
                <div className="flex items-center">
                  <Avatar
                    src={comment.profilePicture || defaultProfileImage}
                    size="small"
                    className="mr-2"
                  />
                  <div>
                    <span className="font-bold mr-2">{comment.username}</span>
                    <span>{comment.comment}</span>
                  </div>
                </div>
              </div>
            ))}

            {post.comments.length > initialCommentsToShow &&
              !showAllComments && (
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setShowAllComments(true)}
                >
                  Show all comments ({post.comments.length})
                </button>
              )}
          </div>
        )}
      </Card>

      {/* Comments Modal */}
      <Modal
        title="Comments"
        open={!!selectedPost}
        onCancel={() => setSelectedPost(null)}
        footer={null}
      >
        {selectedPost && (
          <div>
            <div className="mb-4">
              <Input.TextArea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </div>
            <Button
              type="primary"
              onClick={handlePostComment}
              className="mt-2"
              disabled={loading}
            >
              Add Comment
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Post;

// <div className="Post">
//   {!imageLoaded && <div className="image-skeleton" />}
//   <img
//     src={data.imageUrl}
//     alt="Post"
//     onLoad={handleImageLoad}
//     loading="lazy"
//     style={{ display: imageLoaded ? "block" : "none" }}
//   />
//   <div className="postReact">
//     <img
//       src={
//         data.likes?.some((like) => like.userID === user._id)
//           ? Heart
//           : NotLike
//       }
//       alt="heart icon"
//       className="hover"
//       onClick={likePost}
//     />
//     <img
//       src={Comment}
//       alt="comment icon"
//       className="hover"
//       onClick={handleCommentClick}
//     />
//     <img src={Share} alt="share icon" className="hover" />
//     <img
//       src={Share}
//       alt="new item"
//       className="hover"
//       style={{ marginLeft: "auto", cursor: "pointer" }}
//       onClick={() => {
//         setIsDropdownOpen(!isDropdownOpen);
//         setIsEditing(false); // Close editing mode when opening dropdown
//       }}
//     />
//     {isDropdownOpen && (
//       <div className="dropdown">
//         {user._id === data.user && isEditing ? (
//           <Modal
//             isOpen={isEditing}
//             onRequestClose={() => setIsEditing(false)}
//             contentLabel="Edit Post"
//             style={{
//               content: {
//                 height: "50%",
//                 width: "50%",
//                 top: "25%",
//                 left: "25%",
//                 textAlign: "center",
//               },
//             }}
//           >
//             <h2>Add new description</h2>
//             <button
//               style={{
//                 position: "absolute",
//                 top: "10px",
//                 right: "10px",
//                 cursor: "pointer",
//                 background: "none",
//                 border: "none",
//                 fontSize: "18px",
//               }}
//               onClick={() => setIsEditing(false)}
//             >
//               &times;
//             </button>
//             <textarea
//               value={editedDescription}
//               onChange={(e) => setEditedDescription(e.target.value)}
//               required
//             />
//             <div style={{ marginTop: "20px" }}>
//               <button
//                 className="dropdown-option"
//                 onClick={handleEdit}
//                 style={{
//                   background: "green",
//                   width: "60px",
//                   textAlign: "center",
//                 }}
//               >
//                 Save
//               </button>
//               <button
//                 className="dropdown-option"
//                 onClick={() => setIsEditing(false)}
//                 style={{
//                   background: "red",
//                   width: "60px",
//                   textAlign: "center",
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </Modal>
//         ) : (
//           <>
//             <button
//               className="dropdown-option"
//               onClick={() => setIsEditing(true)}
//             >
//               Edit
//             </button>
//             <button className="dropdown-option" onClick={handleDelete}>
//               Delete
//             </button>
//           </>
//         )}
//       </div>
//     )}
//   </div>
//   <span style={{ color: "var(--gray)", fontSize: "12px" }}>
//     {data.likes?.length} likes
//   </span>
//   {showCommentBox && (
//     <div className="commentBox">
//       <textarea
//         className="commentInput"
//         placeholder="Write your comment..."
//         value={comment}
//         onChange={(e) => setComment(e.target.value)}
//       />
//       <button className="postButton" onClick={handlePostComment}>
//         Post Comment
//       </button>
//     </div>
//   )}
//   <div className="detail">
//     <span>
//       <span onClick={handleUsernameClick} style={{ cursor: "pointer" }}>
//         <b>{data.username}</b>
//       </span>
//     </span>
//     <span> {editedDescription}</span>
//     <span style={{ display: "block", fontSize: "12px" }}>
//       {data.userRole?.charAt(0).toUpperCase() + data.userRole?.slice(1)}
//     </span>
//     {/* Comments UI */}
//     <div className="comments-section">
//       {showAllComments
//         ? data.comments.map((comment, index) => (
//             <div key={index} className="comment">
//               <span className="comment-username">{comment.username}:</span>
//               <span className="comment-text">{comment.comment}</span>
//             </div>
//           ))
//         : data.comments.slice(0, 2).map((comment, index) => (
//             <div key={index} className="comment">
//               <span className="comment-username">{comment.username}:</span>
//               <span className="comment-text">{comment.comment}</span>
//             </div>
//           ))}

//       {!showAllComments && data.comments.length > 2 && (
//         <button className="expand-button" onClick={handleExpandComments}>
//           Show all comments ({data.comments.length})
//         </button>
//       )}
//     </div>
//   </div>
// </div>
