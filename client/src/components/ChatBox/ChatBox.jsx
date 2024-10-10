import React, { useEffect, useState, useRef } from "react";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from 'react-input-emoji'
import { useUserContext } from "../../hooks/useUserContext";
import axios from 'axios';
import io from 'socket.io-client'
import { toast } from 'react-toastify';
import { storage } from "../../firebase-config";

const ChatBox = ({ chat, currentUser, pendingInvites, isPendingInvites, setSendMessage,  receivedMessage }) => {
  console.log("Pending: ", pendingInvites)
  console.log("isPendingInvites : ", isPendingInvites)
  console.log("Chat: ", chat)
  const { user } = useUserContext();
  const [userData, setUserData] = useState(null);
  const [addMember, setAddMember] = useState(false)
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [inviteEmail, setInviteEmail] = useState(""); // State to store the email entered by the user
  console.log("New message: ", newMessage)
  const [showInvites, setShowInvites] = useState(false);
  const [socket, setSocket] = useState(null);
  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // socket io connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // socket io messages
  useEffect(() => {
    if (!socket  || !chat) return;
    console.log("Chat ID in chatbox: ", chat._id)
     // Join the chat room
    socket.emit('join-chat', chat._id);

    socket.emit('new-user-add', currentUser);

    socket.on('receive-message', (data) => {
      console.log("Message received: ", data);
      console.log("Chat ID in receive: ", chat._id)
      console.log("data ID in receive: ", data.chatId)
      if (data.chatId === chat._id) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      socket.off('receive-message');
      socket.emit('leave-chat', chat._id);
    };
  }, [socket, chat,messages]);

  const acceptInvite = async (chatId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/chat/invitation/accept`, {
        chatId: chatId,
        userId: user._id,
      });
    
      // Handle success response
      console.log(response.data);

  }catch (error) {
    console.error('Error creating group:', error);
    toast.error("error in chatBox", error);
    // Handle error, show a message, etc.
  }}
  const rejectInvite = async () => {
  
  }

  const handleChange = (newMessage)=> {
    setNewMessage(newMessage)
  }

  const addMembers = ()=> {
    setAddMember(true)
    console.log("Add Members")
  }

  const inviteMember = async ()=> {
    console.log("Invite Member")
    try {
      const response = await axios.post(`http://localhost:5000/api/chat/invite`, {
        chatId: chat._id,
        userEmail: inviteEmail,
      });
    
      // Handle success response
      console.log(response);
      setInviteEmail("");
     
    
    } catch (error) {
      console.error('Error creating group:', error);

      // Handle error, show a message, etc.
    }
  }

  // fetching data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.log(error);
 
      }
    };

    const fetchPendingInvites = async () => {
      // Fetch pending invites
      try {
        const { data } = await axios.get(`http://localhost:5000/api/chat/invitations/${currentUser}`);
        // setPendingInvites(data);
      } catch (error) {
        console.log(error);
       
      }
    };

    fetchPendingInvites()
    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/messages/${chat._id}`);
        setMessages(data);
      } catch (error) {
        console.log(error);
        
      }
    };

    if (chat) fetchMessages();
  }, [chat]);

  // Always scroll to last Message
  useEffect(()=> {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  },[messages])

  // Send Message
  const handleSend = async (e) => {
    e.preventDefault();

    const message = {
      senderId: currentUser,
      senderName: user.name,
      text: newMessage,
      chatId: chat._id,
    };

    socket.emit('send-message', { ...message, receiverId: chat.members.find((id) => id !== currentUser) });
    // setMessages([...messages, message]);
    try {
      const { data } = await axios.post("http://localhost:5000/api/message/send", message);
      console.log("Message sent: ", data);
      // setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log("error", error);
      toast.error("error in chatBox", error);
    }
  };

// Receive Message from parent component
useEffect(()=> {
  console.log("Message Arrived: ", receivedMessage)
  // if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
  //   setMessages([...messages, receivedMessage]);
  // }

},[receivedMessage])



  const scroll = useRef();
  const imageRef = useRef();
  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            {/* chat-header */}
            <div className="chat-header">
              <div className="follower">
                <div>
                  <img
                  src="https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"

                    alt="Profile"
                    className="followerImage"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="name" style={{ fontSize: "0.9rem" }}>
                    <span>
                      {chat?.groupName}
                    </span>
                    <span>
                      {chat?.semester} {chat?.section}
                    </span>
                    <span onClick={addMembers}>
                      {user.cr && "Add Members"}
                     { addMember &&<> 
                     
                      <input 
                       type="text" 
                       placeholder="Enter email ID"
                       value={inviteEmail} // Bind the input value to the state
                       onChange={(e) => setInviteEmail(e.target.value)} // Update the state on change
                     />
                     <button onClick={inviteMember}>Invite</button>
                     
                     </>}
                    </span>
                  </div>
                </div>
              </div>
              <hr
                style={{
                  width: "95%",
                  border: "0.1px solid #ececec",
                  marginTop: "20px",
                }}
              />
            </div>
            {/* chat-body */}
            <div className="chat-body" >
              {messages.map((message) => (
                <>
                  <div ref={scroll}
                    className={
                      message.senderId === currentUser
                        ? "message own"
                        : "message"
                    }
                  >
                    <span>{message.text}</span>{" "}
                    <span>{format(message.createdAt)}</span>
                  </div>
                </>
              ))}
            </div>
            {/* chat-sender */}
            <div className="chat-sender">
              <div onClick={() => imageRef.current.click()}>+</div>
              <InputEmoji
                value={newMessage}
                onChange={handleChange}
              />
              <div className="send-button button" onClick = {handleSend}>Send</div>
              {/* <input
                type="file"
                name=""
                id=""
                style={{ display: "none" }}
                ref={imageRef}
              /> */}
            </div>{" "}
          </>
        ) :  isPendingInvites === true ?   
        <div className="pending-invites-container">
        {pendingInvites.map((invite) => (
            <div key={invite._id} className="pending-invite-item">
                <p>You are invited to join:</p>
                <p>{invite.groupName}</p>
                <p>{invite.semester} {invite.section}</p>
                {/* Add styling for pending invite item */}
                <button onClick={()=>acceptInvite(invite._id)}>Accept</button>
                <button onClick={rejectInvite}>Reject</button>
            </div>
        ))}
    </div> : (
          <span className="chatbox-empty-message">
            Tap on a chat to start conversation...
          </span>
        )} 
      </div>
    </>
  );
};

export default ChatBox;
