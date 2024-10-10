import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { useLocation } from "react-router-dom";
import ProfileSide from "../profileSide/ProfileSide";
import RightSide from "../RightSide/RightSide";
import axios from "axios";
import { useUserContext } from "../../hooks/useUserContext";
import { defaultCoverImage, defaultProfileImage } from "../../common/common";

export default function UserProfile({}) {
  const location = useLocation();
  const newUser = location.state.newUser;
  const { user } = useUserContext();
  console.log(newUser);
  const makeCR = () => {
    axios
      .post(
        "http://localhost:5000/auth/profile/cr",
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

  const blockUser = () => {
    axios
      .post(
        "http://localhost:5000/auth/profile/block",
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

  // useEffect(() => {
  //     axios.post("http://localhost:5000/auth/profile/findbyid",   { userID: userID },
  //         { withCredentials: true, headers: { 'Content-Type': 'application/json' } }

  //     )
  //         .then((res) => {
  //            console.log("found user",res.data);
  //               setUser(res.data);
  //         })
  //         .catch((error) => {
  //             console.error("Axios Request Error:", error);
  //         });
  //   }, [userID]);

  return (
    <div className="Home">
      <ProfileSide />

      <div className="ProfileCard">
        <h1>User profile</h1>
        <div className="ProfileImages">
          <img src={newUser?.coverPicture || defaultCoverImage} alt="cover" />
          <img src={newUser?.profilePicture || defaultProfileImage} alt="profile" />
        </div>

        <div className="ProfileName">
          <span>{newUser?.name}</span>
          <span>
            {newUser?.tagline.charAt(0).toUpperCase() +
              newUser.tagline.slice(1)}
          </span>
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
        </div>
      </div>
      <RightSide />
    </div>
  );
}
