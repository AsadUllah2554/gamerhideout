import React, { useState } from "react";
import { useEffect } from "react";

const Conversation = ({ data, currentUser, online }) => {

const [userData, setUserData] = useState(null)

  useEffect(()=> {

    const userId = data.members.find((id)=>id!==currentUser)
    const getUserData = async ()=> {
      try
      {
          const {data} =await getUser(userId)
         setUserData(data)
       
      }
      catch(error)
      {
        console.log(error)
      }
    }

    getUserData();
  }, [])
  return (
    <>
      <div className="follower conversation">
        <div>
          {online && <div className="online-dot"></div>}
          <img
            // src={userData?.profilePicture? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture : process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"}
           src="https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
            alt="Profile"
            className="followerImage"
            style={{ width: "50px", height: "50px" }}
          />
          <div className="name" style={{fontSize: '0.9rem'}}>
            <span>{data?.groupName}</span>
            <span style={{color: online?"#51e200":""}}>{data?.semester} {data?.section}</span>
            {/* <span style={{color: online?"#51e200":""}}>{online? "Online" : "Offline"}</span> */}
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default Conversation;
