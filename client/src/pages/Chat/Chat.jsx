import React, { useEffect, useRef, useState } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Coversation/Conversation";
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import NavIcons from "../../components/Navbar/Navbar";
import "./Chat.css";
import { io } from "socket.io-client";
import { useUserContext } from "../../hooks/useUserContext";
import ReactModal from "react-modal";
import axios from "axios";
import { toast } from "react-toastify";

const Chat = () => {
  const { user } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState(""); // State for group name
  const [semester, setSemester] = useState(""); // State for semester
  const [section, setSection] = useState(""); // State for section
  const [userGroups, setUserGroups] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [isPendingInvites, setIsPendingInvites] = useState(false);
  console.log("pendingInvites:", pendingInvites);
  console.log("length:", pendingInvites.length);

  console.log("userGroups:", userGroups);
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // create Chat group function
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.SERVER_URL}/api/chat/creategroup`,
        {
          creatorId: user._id,
          groupName: groupName,
          semester: semester,
          section: section,
          members: [{ user: user._id, status: "accepted" }],
        }
      );

      // Handle success response
      console.log(response.data);
      setGroupName("");
      setSemester("");
      setSection("");
      setIsModalOpen(false); // Close the modal after successful creation
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Error creating group:", error);
    }
  };

  const handlePendingInvites = async () => {
    setIsPendingInvites((prevState) => !prevState);
  };
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  useEffect(() => {
    // Fetch user groups when the component mounts
    const fetchUserGroups = async () => {
      try {
        const response = await axios.get(
          `${process.env.SERVER_URL}/api/chat/groups/${user._id}`
        );
        console.log("User groups: ", response.data.userGroups);
        const userAcceptedGroups = response.data.userGroups.filter((group) =>
          group.members.some(
            (member) =>
              member.user._id === user._id && member.status === "accepted"
          )
        );
        setUserGroups(userAcceptedGroups);
      } catch (error) {
        console.error("Error fetching user groups:", error);
        toast.error("Error fetching user groups:", error);
      }
    };
    fetchUserGroups();
    // const socket = io('http://localhost:5000');
    // Establish socket connection when the component mounts
    socket.current = io("ws://localhost:5000", {
      cors: {
        origin: "http://localhost:3000",
      },
    });
    socket.current.emit("new-user-add", user._id);

    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.current.disconnect();
    };
  }, [user._id]);

  useEffect(() => {
    const fetchPendingInvites = async () => {
      try {
        const response = await axios.get(
          `${process.env.SERVER_URL}/api/chat/invitations/${user._id}`
        );
        console.log("Pending invites: ", response.data);
        setPendingInvites(response.data.pendingInvitations);
      } catch (error) {
        console.error("Error fetching pending invites:", error);
        toast.error("Error fetching pending invites:", error);
      }
    };
    fetchPendingInvites();
  }, [user._id]);

  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <LogoSearch />
        <div className="Chat-container">
          <h2>Chats</h2>
          <p onClick={handlePendingInvites}>
            Pending invitations {pendingInvites.length}
          </p>
          {user.cr && <p onClick={handleModalOpen}>Create new group</p>}
          <ReactModal
            isOpen={isModalOpen}
            onRequestClose={handleModalClose}
            style={{
              content: {
                width: "800px", // Set the desired width
                margin: "auto", // Automatically centers the modal horizontally
                display: "flex", // Use flexbox
                justifyContent: "center", // Center the content horizontally
                alignItems: "center", // Center the content vertically
              },
            }}
          >
            <div className="modal-header">
              <button onClick={handleModalClose}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="profile-details">
                <h2 onClick={handleModalOpen}>Create a class group</h2>
                <p>Group name</p>
                <input
                  type="text"
                  name="name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter Class group name"
                  maxLength="26"
                />
                <p>Semester</p>
                <input
                  type="text"
                  name="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="Enter Semester"
                  maxLength="26"
                />
                <p>Section</p>
                <input
                  type="text"
                  name="section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="Enter section"
                  maxLength="26"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleSubmit}>Create group</button>
              <button onClick={() => handleModalClose(true)}>Cancel</button>
            </div>
          </ReactModal>
          <div className="Chat-list">
            {userGroups.map((group) => (
              <div key={group._id} onClick={() => setCurrentChat(group)}>
                <Conversation data={group} online={false} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          <NavIcons />
        </div>
        <ChatBox
          chat={currentChat}
          currentUser={user._id}
          isPendingInvites={isPendingInvites}
          pendingInvites={pendingInvites}
        />
      </div>
    </div>
  );
};

export default Chat;
