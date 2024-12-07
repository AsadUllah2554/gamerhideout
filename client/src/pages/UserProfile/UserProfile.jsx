import React, { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Button,
  Tabs,
  Modal,
  Upload,
  Form,
  Input,
  message,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  UploadOutlined,
  HeartOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useUserContext } from "../../hooks/useUserContext";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import backgroundImage from "../../assets/images/hero.png";
import { defaultCoverImage, defaultProfileImage } from "../../common/common";
import { LoadingSpinner } from "../../components/Loading/Loader";
import { FeatureUnderDevelopmentModal } from "../../components/UnderDevelopment/FeatureUnderDevelopment";

const UserProfile = () => {
  const { user: currentUser, setUser } = useUserContext();
  const [user, setProfileUser] = useState(null);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState();
  const [coverImage, setCoverImage] = useState();
  console.log("currentUser ", currentUser);
  const { id } = useParams(); // Gets the user ID from the URL
  console.log("userId ", id);

  console.log("user ", user);
  const [posts, setPosts] = useState([]);
  console.log("posts ", posts);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isFriend, setIsFriend] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      console.log("userId in try ");
      if (!id) {
        console.log("currentUser in else");
        setProfileUser(currentUser);
        setIsOwnProfile(true);
        // const response = await fetchUserProfileById(userId);
        // setProfileUser(response.data);
      } else {
        console.log("userId in else ");
        const fetchedUser = await axios.post(
          `${process.env.SERVER_URL}/auth/profile/findbyid`,
          { id },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        console.log("found user", fetchedUser.data.user);
        setProfileUser(fetchedUser.data.user);
      }
      const targetUserId = id || currentUser._id;
      // Fetch user's posts
      const postsResponse = await axios.get(
        `${process.env.SERVER_URL}/api/posts/${targetUserId}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      console.log("Posts response: ", postsResponse.data.posts);
      setPosts(postsResponse.data.posts);
      setLoading(false);
      // Check friendship status
      // const friendshipResponse = await axios.get(
      //   `${process.env.SERVER_URL}/api/friends/status/${targetUserId}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${currentUser.token}`,
      //     },
      //   }
      // );
      // setIsFriend(friendshipResponse.data.isFriend);
    } catch (error) {
      console.error("Error fetching profile:", error);
      // setLoading(false);
      message.error("Failed to load profile");
    }
  };

  const handleFriendAction = async () => {
    try {
      if (isFriend) {
        // Remove friend
        await axios.delete(
          `${process.env.SERVER_URL}/api/friends/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setIsFriend(false);
        message.success("Removed from friends");
      } else {
        // Add friend
        await axios.post(
          `${process.env.SERVER_URL}/api/friends/add`,
          { friendId: user._id },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setIsFriend(true);
        message.success("Friend request sent");
      }
    } catch (error) {
      console.error("Error managing friendship:", error);
      message.error("Failed to manage friendship");
    }
  };

  const handleProfilePictureChange = (info) => {
    const selectedFile = info.file.originFileObj || info.file;
    if (selectedFile) {
      setProfileImage(selectedFile);
    }
  };

  const handleCoverPictureChange = (info) => {
    const selectedFile = info.file.originFileObj || info.file;
    if (selectedFile) {
      setCoverImage(selectedFile);
    }
  };

  const handleProfileUpdate = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("bio", data.bio);
      if (profileImage) formData.append("profilePicture", profileImage);
      if (coverImage) formData.append("coverPicture", coverImage);

      const response = await axios.patch(
        `${process.env.SERVER_URL}/auth/profile/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.error) {
        message.error(response.data.error.message);
        return;
      }
      console.log(response);

      setUser((prevUser) => ({
        ...prevUser,
        name: data.name,
        bio: data.bio,
        profilePicture: response.data.profilePicture || prevUser.profilePicture,
        coverPicture: response.data.coverPicture || prevUser.coverPicture,
      }));
      console.log("User updated", currentUser);
      message.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile");
    }

    setIsModalOpen(false);
  };

  useEffect(() => {
    console.log("useEffect hook empty ");
    fetchUserProfile();
  }, [id]);

  if (loading) return <LoadingSpinner tip="Loading.." />;
  if (!user)
    return (
      <>
        <Navbar title={"User not found"} />
      </>
    );
  return (
    // <div>Profile </div>
    <div className="min-h-screen bg-gray-100 relative">
      <div
        className="absolute inset-0 opacity-5 bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundPosition: "right center",
        }}
      />
      <Navbar
        title={`${isOwnProfile ? currentUser.name : user.name}'s Profile`}
      />

      <div className="container mx-auto pt-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div>
            <Card
              className="mb-6 overflow-hidden"
              cover={
                <img
                  src={
                    isOwnProfile
                      ? currentUser.coverPicture
                      : user.coverPicture || defaultCoverImage
                  }
                  alt="Cover"
                  className="w-full h-32 object-cover"
                />
              }
            >
              <div className="text-center relative">
                <Avatar
                  size={100}
                  icon={<UserOutlined />}
                  className="absolute -top-16 left-1/2 transform -translate-x-1/2 border-4 border-white"
                  src={
                    isOwnProfile
                      ? currentUser.profilePicture
                      : user.profilePicture || defaultProfileImage
                  }
                />
              </div>
              <div className="mt-8 text-center">
                <h2 className="text-xl font-bold mt-4">
                  {isOwnProfile ? currentUser.name : user.name}
                </h2>
                <p className="text-gray-600">
                  {isOwnProfile ? currentUser.bio : user.bio}
                </p>
                <div className="mt-4 flex justify-around">
                  <div>
                    <strong>{posts.length}</strong>
                    <p className="text-gray-600">Posts</p>
                  </div>
                  <div>
                    <strong>{user.friendsCount || 0}</strong>
                    <p className="text-gray-600">Friends</p>
                  </div>
                </div>

                {isOwnProfile ? (
                  <div className="mt-4 space-x-2">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => setIsModalOpen(true)}
                    >
                      Edit Profile
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 space-x-2">
                    <Button
                      type={isFriend ? "default" : "primary"}
                      onClick={() => setIsFeatureModalOpen(true)}
                    >
                      {isFriend ? "Remove Friend" : "Add Friend"}
                    </Button>
                    <Button onClick={() => setIsFeatureModalOpen(true)}>
                      Message
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Posts Section */}
          <div className="md:col-span-2">
            <Card title="Posts">
              <div className="">
                {posts.length > 0 &&
                  posts.map((post) => (
                    <Card
                      key={post._id}
                      className="mb-4"
                      hoverable
                      cover={
                        post.imageUrl && (
                          <div className=" overflow-hidden">
                            <img
                              alt={post.title}
                              src={post.imageUrl}
                              className="w-full rounded-lg mb-4 object-cover max-h-96"
                            />
                          </div>
                        )
                      }
                      actions={[
                        <HeartOutlined key="like" />,
                        <ShareAltOutlined key="share" />,
                      ]}
                    >
                      <Card.Meta
                        title={post.title}
                        description={post.description}
                      />
                    </Card>
                  ))}
              </div>
              {posts.length === 0 && (
                <p className="text-center text-gray-500">No posts yet</p>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleProfileUpdate}
          initialValues={{
            name: currentUser.name,
            bio: currentUser.bio,
          }}
        >
          <Form.Item name="image" label="Profile Picture">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              onChange={handleProfilePictureChange}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="coverPicture" label="Cover Picture">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              onChange={handleCoverPictureChange}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="name" label="Full Name">
            <Input />
          </Form.Item>

          <Form.Item name="bio" label="Bio">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <FeatureUnderDevelopmentModal
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
        featureName="Adding/Messaging friends"
        additionalDetails="Real-time messaging is coming soon! We're working on providing a seamless communication experience."
      />
    </div>
  );
};

export default UserProfile;
// useEffect(() => {
//   console.log("useEffect hook ");
//   const fetchUserProfile = async () => {
// setLoading(true);
// try {
//   console.log("userId in try ");
//   if (!userId) {
//     console.log("currentUser in else");
//     setProfileUser(currentUser);

//     // const response = await fetchUserProfileById(userId);
//     // setProfileUser(response.data);

//   } else {
//     console.log("userId in else ");
//     const userResponse = await axios.get(
//       `${process.env.SERVER_URL}/auth/profile/${targetUserId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${currentUser.token}`,
//         },
//       }
//     );
//     setProfileUser(userResponse.data);
//   }
//   const targetUserId = userId || currentUser._id;
//   // Fetch user's posts
//   const postsResponse = await axios.get(
//     `${process.env.SERVER_URL}/api/posts/${targetUserId}`,
//     {
//       headers: {
//         Authorization: `Bearer ${currentUser.token}`,
//       },
//     }
//   );
//   console.log("Posts response: ", postsResponse.data);
//   setPosts(postsResponse.data);
//   setLoading(false);
//   // Check friendship status
//   // const friendshipResponse = await axios.get(
//   //   `${process.env.SERVER_URL}/api/friends/status/${targetUserId}`,
//   //   {
//   //     headers: {
//   //       Authorization: `Bearer ${currentUser.token}`,
//   //     },
//   //   }
//   // );
//   // setIsFriend(friendshipResponse.data.isFriend);
// } catch (error) {
//   console.error("Error fetching profile:", error);
//   setLoading(false);
//   message.error("Failed to load profile");
// }

// fetchUserProfile();
// }, []);
// const { user: currentUser, setUser } = useUserContext();
// const [user, setProfileUser] = useState(null);
// console.log("currentUser ", currentUser);
// const { userId } = useParams(); // Gets the user ID from the URL
// if(!userId) {
//   console.log("userId is null");
//   setProfileUser(currentUser);
// }
// console.log("userId ", userId);

// console.log("user ", user);
// const [posts, setPosts] = useState([]);
// console.log("posts ", posts);
// const [isOwnProfile, setIsOwnProfile] = useState(false);
// const [isModalOpen, setIsModalOpen] = useState(false);
// const [image, setImage] = useState(null);
// const [form] = Form.useForm();
// const [isFriend, setIsFriend] = useState(false);
// const [loading, setLoading] = useState(false);

// const handleFriendAction = async () => {
//   try {
//     if (isFriend) {
//       // Remove friend
//       await axios.delete(
//         `${process.env.SERVER_URL}/api/friends/${user._id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${currentUser.token}`,
//           },
//         }
//       );
//       setIsFriend(false);
//       message.success("Removed from friends");
//     } else {
//       // Add friend
//       await axios.post(
//         `${process.env.SERVER_URL}/api/friends/add`,
//         { friendId: user._id },
//         {
//           headers: {
//             Authorization: `Bearer ${currentUser.token}`,
//           },
//         }
//       );
//       setIsFriend(true);
//       message.success("Friend request sent");
//     }
//   } catch (error) {
//     console.error("Error managing friendship:", error);
//     message.error("Failed to manage friendship");
//   }
// };

// const handleImageChange = (info) => {
//   const selectedFile = info.file.originFileObj || info.file;
//   if (selectedFile) {
//     setImage(selectedFile);
//   }
// };

// const handleProfileUpdate = async (data) => {
//   try {
//     const formData = new FormData();
//     formData.append("fullName", data.fullName);
//     formData.append("bio", data.bio);
//     if (image) formData.append("image", image);

//     const response = await axios.patch(
//       `${process.env.SERVER_URL}/auth/profile/${currentUser._id}`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${currentUser.token}`,
//         },
//       }
//     );

//     // Update user context
//     setUser((prevUser) => ({
//       ...prevUser,
//       name: data.fullName,
//       bio: data.bio,
//       profilePicture: response.data.profilePicture || prevUser.profilePicture,
//       coverPicture: response.data.coverPicture || prevUser.coverPicture,
//     }));

//     message.success("Profile updated successfully");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     message.error("Failed to update profile");
//   }
// };

// if (loading) return <div>Loading...</div>;

// <div className="min-h-screen bg-gray-100 relative">
//   <div
//     className="absolute inset-0 opacity-5 bg-no-repeat bg-cover"
//     style={{
//       backgroundImage: `url('${backgroundImage}')`,
//       backgroundPosition: "right center",
//     }}
//   />
//   <Navbar title={`${user.name}'s Profile`} />

//   <div className="container mx-auto pt-24 px-4">
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       {/* Profile Card */}
//       <div>
//         <Card
//           className="mb-6 overflow-hidden"
//           cover={
//             <img
//               src={user.coverPicture || defaultCoverImage}
//               alt="Cover"
//               className="w-full h-32 object-cover"
//             />
//           }
//         >
//           <div className="text-center relative">
//             <Avatar
//               size={100}
//               icon={<UserOutlined />}
//               className="absolute -top-16 left-1/2 transform -translate-x-1/2 border-4 border-white"
//               src={user.profilePicture || defaultProfileImage}
//             />
//           </div>
//           <div className="mt-8 text-center">
//             <h2 className="text-xl font-bold mt-4">{user.name}</h2>
//             <p className="text-gray-600">{user.bio}</p>
//             <div className="mt-4 flex justify-around">
//               <div>
//                 <strong>{posts.length}</strong>
//                 <p className="text-gray-600">Posts</p>
//               </div>
//               <div>
//                 <strong>{user.friendsCount || 0}</strong>
//                 <p className="text-gray-600">Friends</p>
//               </div>
//             </div>

//             {isOwnProfile ? (
//               <div className="mt-4 space-x-2">
//                 <Button
//                   icon={<EditOutlined />}
//                   onClick={() => setIsModalOpen(true)}
//                 >
//                   Edit Profile
//                 </Button>
//               </div>
//             ) : (
//               <div className="mt-4 space-x-2">
//                 <Button
//                   type={isFriend ? "default" : "primary"}
//                   onClick={handleFriendAction}
//                 >
//                   {isFriend ? "Remove Friend" : "Add Friend"}
//                 </Button>
//                 <Button>Message</Button>
//               </div>
//             )}
//           </div>
//         </Card>
//       </div>

//       {/* Posts Section */}
//       <div className="md:col-span-2">
//         <Card title="Posts">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {posts.map((post) => (
//               <Card
//                 key={post._id}
//                 hoverable
//                 cover={
//                   post.imageUrl && (
//                     <div className="h-48 overflow-hidden">
//                       <img
//                         alt={post.title}
//                         src={post.imageUrl}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   )
//                 }
//                 actions={[
//                   <HeartOutlined key="like" />,
//                   <ShareAltOutlined key="share" />,
//                 ]}
//               >
//                 <Card.Meta
//                   title={post.title}
//                   description={post.description}
//                 />
//               </Card>
//             ))}
//           </div>
//           {posts.length === 0 && (
//             <p className="text-center text-gray-500">No posts yet</p>
//           )}
//         </Card>
//       </div>
//     </div>
//   </div>

//   {/* Edit Profile Modal */}
//   <Modal
//     title="Edit Profile"
//     open={isModalOpen}
//     onCancel={() => setIsModalOpen(false)}
//     footer={null}
//   >
//     <Form
//       form={form}
//       layout="vertical"
//       onFinish={handleProfileUpdate}
//       initialValues={{
//         fullName: currentUser.name,
//         bio: currentUser.bio,
//       }}
//     >
//       <Form.Item name="image" label="Profile Picture">
//         <Upload
//           beforeUpload={() => false}
//           maxCount={1}
//           onChange={handleImageChange}
//         >
//           <Button icon={<UploadOutlined />}>Change Picture</Button>
//         </Upload>
//       </Form.Item>

//       <Form.Item
//         name="fullName"
//         label="Full Name"
//         rules={[{ required: true, message: "Please input your name!" }]}
//       >
//         <Input />
//       </Form.Item>

//       <Form.Item name="bio" label="Bio">
//         <Input.TextArea rows={4} />
//       </Form.Item>

//       <Form.Item>
//         <Button type="primary" htmlType="submit">
//           Update Profile
//         </Button>
//       </Form.Item>
//     </Form>
//   </Modal>
// </div>
