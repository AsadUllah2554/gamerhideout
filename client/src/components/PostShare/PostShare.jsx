import React, { useState, useRef, useContext, useEffect } from "react";
import "./PostShare.css";
import { useUserContext } from "../../hooks/useUserContext";
import axios from "axios";
import { PostContext } from "../../context/postContext";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";
import { defaultProfileImage } from "../../common/common";
import { Form, message, Upload } from "antd";
import { UilScenery } from "@iconscout/react-unicons";

const PostShare = () => {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useUserContext();
  const { post, setPost, posts, setPosts } = useContext(PostContext);
  console.log("post in post share: ", post);

  console.log("Posts in share:", posts);

  const handleImageChange = (info) => {
    const selectedFile = info.file.originFileObj || info.file;
    if (selectedFile) {
      setImage(selectedFile);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      if (!image) {
        setError("No image selected.");
        message.error("Error logging user on backend:", error);
        return;
      }
      formData.append("image", image);
      formData.append("description", description);
      formData.append("user", user._id);
      formData.append("username", user.username);
      formData.append("name", user.name);

      // Sending to database
      const response = await axios.post(
        `${process.env.SERVER_URL}/api/post/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Post shared successfully");
      setDescription("");
      setImage(null);
      setError("");
      console.log("Post in share:", response.data.data);
      setPosts((prevPosts) => [response.data.data, ...prevPosts]);

      setLoading(false);
    } catch (error) {
      console.error("Error logging user on backend:", error);
      toast.error("Error logging user on backend:", error);
      setError(`Error logging user on backend:  ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="PostShare">
      <img src={user.profilePicture || defaultProfileImage} alt="profile " />
      <HashLoader
        loading={loading}
        color="#00aaff"
        size={50}
        cssOverride={{
          display: "block",
        }}
      />

      <div>
        <input
          type="text"
          placeholder="What's happening?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="postOptions">
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleImageChange}
          >
            <div className="option">
              <UilScenery />
            </div>
          </Upload>

          <button className="button ps-button" onClick={handleShare}>
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostShare;
