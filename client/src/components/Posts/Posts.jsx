import React, {  useEffect, useContext } from "react";
import "./Posts.css";
import Post from "../Post/Post";
import axios from "axios";
import { PostContext } from "../../context/postContext";
import { useUserContext } from "../../hooks/useUserContext";
import { message } from "antd";

const Posts = () => {
  const { posts, setPosts } = useContext(PostContext);
  const { user } = useUserContext()
  console.log("User in posts: ", user);
  console.log("Posts:", posts);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${process.env.SERVER_URL}/api/posts`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log("Posts response: ", response);
      setPosts(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      message.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (user) {
      fetchPosts();
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <div className="Posts">
      {posts.map((post) => {
        return <Post data={post} id={post._id} key={post._id} />;
      })}
    </div>
  );
};

export default Posts;
