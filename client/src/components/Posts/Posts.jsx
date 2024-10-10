import React, { useState, useEffect, useContext } from "react";
import "./Posts.css";
import Post from "../Post/Post";
import axios from "axios";
import { PostContext } from "../../context/postContext";
import { ColorSchemeScript } from "@mantine/core";
import { toast } from "react-toastify";

const Posts = () => {
  // const [posts, setPosts] = useState([]);

  const { posts, setPosts } = useContext(PostContext);
  console.log("Posts:", posts);

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`http://localhost:5000/api/posts`)
      .then((response) => {
        // Update state with fetched posts

        setPosts(response.data.data);
        console.log("Posts:", response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        toast.error("Error fetching posts:", error);
      });
      return () => {
        isMounted = false;
      };
  }, []);

  return (
    <div className="Posts">
      {posts.map((post) => {
        return <Post data={post} id={post._id} key={post._id} />;
      })}
    </div>
  );
};

export default Posts;
