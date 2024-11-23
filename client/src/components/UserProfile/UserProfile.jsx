import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { useLocation } from "react-router-dom";
import ProfileSide from "../profileSide/ProfileSide";
import RightSide from "../RightSide/RightSide";
import axios from "axios";
import { useUserContext } from "../../hooks/useUserContext";
import { defaultCoverImage, defaultProfileImage } from "../../common/common";
import { Button } from "antd";
import Post from "../Post/Post";

export default function UserProfile({}) {
  const [posts, setPosts] = useState([]);

  console.log("Posts in UserProfile:", posts);
  console.log("Loading in UserProfile:", posts.posts);
  const location = useLocation();
  const newUser = location.state.newUser;
  console.log("newUser in UserProfile: ", newUser);
  const { user } = useUserContext();
  console.log(newUser);

  const fetchPosts = async () => {
    try {
      const userId = newUser._id;
      console.log("userId in profile: ", userId);
      const response = await axios.get(
        `${process.env.SERVER_URL}/api/post/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Posts response in profile: ", response.data);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
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

  const sendFriendRequest = () => {
    axios
      .post(
        `${process.env.SERVER_URL}/auth/profile/friend`,
        { userID: newUser._id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        console.log("found user", res.data);
        setUser(res.data);
      })
      .catch((error) => {
        console.error("Axios Request Error:", error);
      });
  };

  const blockUser = () => {
    axios
      .post(
        `${process.env.SERVER_URL}/auth/profile/block`,
        { userID: newUser._id },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        console.log("found user", res.data);
        setUser(res.data);
      })
      .catch((error) => {
        console.error("Axios Request Error:", error);
      });
  };

  return (
    <div className="Home">
      <ProfileSide />

      <div className="ProfileCard">
        <h1>User profile</h1>
        <div className="ProfileImages">
          <img src={newUser?.coverPicture || defaultCoverImage} alt="cover" />
          <img
            src={newUser?.profilePicture || defaultProfileImage}
            alt="profile"
          />
        </div>

        <div className="ProfileName">
          <span>{newUser?.name}</span>
          {newUser.tagline && (
            <span>
              {newUser?.tagline.charAt(0).toUpperCase() +
                newUser.tagline.slice(1)}
            </span>
          )}
        </div>

        <div className="followStatus">
          <hr />
          <div>
            <div className="follow">
              <span>{newUser?.semester}</span>
              <span>Semester</span>
            </div>
            <div className="vl"></div>
            <div className="follow">
              <span>2,400</span>
              <span>Followers</span>
            </div>
          </div>
          <hr />
          <Button
            onClick={sendFriendRequest}
            type="primary"
            style={{ cursor: "pointer" }}
          >
            Add Friend
          </Button>
        </div>
        {posts.posts && posts.posts.length > 0 && (
          <div className="Posts">
            {posts.posts.map((post) => {
              return <Post data={post} id={post._id} key={post._id} />;
            })}
          </div>
        )}
      </div>

      <RightSide />
    </div>
  );
}
