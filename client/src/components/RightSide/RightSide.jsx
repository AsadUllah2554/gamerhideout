import React, { useContext, useState } from "react";
import "./RightSide.css";
import Home from "../../img/home.png";
import Noti from "../../img/noti.png";
import Comment from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";
import TrendCard from "../TrendCard/TrendCard";
import ShareModal from "../ShareModal/ShareModal";
import axios from "axios";
import { ColorSchemeScript } from "@mantine/core";
import UnverifiedPostsModal from "../UnverifiedPosts/UnverifiedPosts";
import { useUserContext } from "../../hooks/useUserContext";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { PostContext } from "../../context/postContext";
import { set } from "firebase/database";

const RightSide = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [unverifiedPosts, setunverifiedPosts] = useState([]);
  const [notifcations, setNotifcations] = useState([]);
  const [message, setMessage] = useState("");
  const {user,logout} = useUserContext();
  const navigate = useNavigate();
  const {post,posts,setPosts,setPost} = useContext(PostContext);

  const getNotifications = () => {
    // Axios GET request
    setPost('notifications')
    axios.get(`${process.env.SERVER_URL}/api/notifications`)
      .then(response => {
        // Update state with fetched posts
      
        setNotifcations(response.data.data);

      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
    }

//   const logout =  () => {
//   try {
//      axios.post('http://localhost:5000/auth/logout',{ withCredentials: true });
//     // Redirect or perform any other actions after successful logout
//   } catch (error) {
//     console.error('Error logging out:', error.message);
//     // Handle error if necessary
//   }
// };

 
  // const getUnVerifiedPosts = () => {
  //   // Check if the user is an admin
  //   if (user && user.role === "admin") {
  //     axios
  //       .get("http://localhost:5000/api/posts/unverified")
  //       .then((response) => {
  //         setunverifiedPosts(response.data.data);
  //         setModalOpened(true);
  //         console.log("unverifiedPosts", response.data.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching posts:", error);
  //   } else {
  //     // Display a message if the user is not an admin
  //     setMessage("Not an admin");
  //   }
  // };

  return (
    <div className="RightSide">
      <div className="navIcons">
 <Link to={"/"} >      <img src={Home} alt="" /> </Link> 
 <Link to="/market" >        <UilSetting /> </Link> 
  <img src={Noti} alt="notifcation" onClick={getNotifications} />   
  {/* {(user.role === "admin") && <img src={Comment} alt="" onClick={getUnVerifiedPosts} />} */}
  <Link to="/chat"><img src={Comment} alt="" /></Link>
    
      </div>
      <TrendCard />
      <button className="button r-button" onClick={logout}>
        Logout
      </button>
      <ShareModal modalOpened={modalOpened} setModalOpened={setModalOpened} />
       {/* Pass unverifiedPosts to the UnverifiedPostsModal component */}
       <UnverifiedPostsModal
        isOpen={modalOpened}
        closeModal={() => setModalOpened(false)}
        unverifiedPosts={unverifiedPosts}
        setunverifiedPosts={setunverifiedPosts}
      />
      {message && <h1>{message}</h1>}
    </div>
  );
};

export default RightSide;