import React, { useState } from "react";
import Cover from "../../img/mainn.jpg";
import axios from "axios";
import "./ProfileCard.css";
import { useUserContext } from "../../hooks/useUserContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase-config";
import { defaultCoverImage, defaultProfileImage } from "../../common/common";

import {
  Avatar,
  Card,
  Descriptions,
  Typography,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
} from "antd";

import {
  UserOutlined,
  MailOutlined,
  BankOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Title from "antd/es/typography/Title";

// Fallback images

const ProfileCard = () => {
  const { user, setUser } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [profileImage, setProfileImage] = useState();
  const [coverImage, setCoverImage] = useState();

  const [form] = Form.useForm();

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    form.resetFields();
    setProfileImage(null);
    setCoverImage(null);
    setIsModalOpen(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  let profilePicture, coverPicture;

  const handleUpdate = async (data) => {
    try {
      // Create form data for backend multer upload
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("bio", data.bio);
      if (profileImage) formData.append("profilePicture", profileImage);
      if (coverImage) formData.append("coverPicture", coverImage);

      const response = await axios.patch(
        `http://localhost:5000/auth/profile/${user._id}`,
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
      // Update user context
      setUser((prevUser) => ({
        ...prevUser,
        name: data.fullName,
        bio: data.bio,
        profilePicture: response.data.profilePicture || prevUser.profilePicture,
        coverPicture: response.data.coverPicture || prevUser.coverPicture,
      }));

      message.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile");
    }

    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !profileImage &&
      !coverImage &&
      editedUser.bio === user.bio &&
      editedUser.semester === user.semester
    ) {
      console.log("No changes detected, skipping API call");
      setIsModalOpen(false);
      return;
    }

    if (profileImage) {
      try {
        const profileRef = ref(storage, `images/profile/${profileImage.name}`);
        await uploadBytesResumable(profileRef, profileImage);
        profilePicture = await getDownloadURL(profileRef);
      } catch (error) {
        console.error("Error uploading profile image:", error);
        // Handle image upload error
      }
    }

    if (coverImage) {
      try {
        const coverRef = ref(storage, `images/cover/${coverImage.name}`);
        await uploadBytesResumable(coverRef, coverImage);
        coverPicture = await getDownloadURL(coverRef);
      } catch (error) {
        console.error("Error uploading cover image:", error);
        // Handle image upload error
      }
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/auth/profile/edit`,
        {
          userID: editedUser._id,
          tagline:
            editedUser.tagline !== user.tagline
              ? editedUser.tagline
              : undefined,
          semester:
            editedUser.semester !== user.semester
              ? editedUser.semester
              : undefined,
          profilePicture: profilePicture,
          coverPicture: coverPicture,
        }
      );
      console.log(response.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error editing profile:", error);
      // Handle error, show a message, etc.
    }
  };

  return (
    <div className="ProfileCard">
      <div className="ProfileImages">
        <img src={user.coverPicture || defaultCoverImage} alt="cover" />
        <img src={user.profilePicture || defaultProfileImage} alt="profile" />
      </div>

      <div className="ProfileName">
        <span>{user.name}</span>
        <span>{user.bio?.charAt(0).toUpperCase() + user.bio?.slice(1)}</span>
      </div>

      <div className="followStatus">
        <hr />
        <div>
          <div className="  follow ">
            <span>{user.semester}</span>
            <span className="">Posts</span>
          </div>
          <div className="vl"></div>
          <div className="follow">
            <span>2,400</span>
            <span>Followers</span>
          </div>
        </div>
        <hr />
      </div>

      <span onClick={handleModalOpen}>My Profile</span>
      <Modal
        title="Profile Details"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        className=" -mt-20"
      >
        <Card
          cover={
            <img
              src={user.coverPicture || defaultCoverImage}
              alt="Cover"
              style={{ width: "100%", height: "120px", objectFit: "cover" }} // Adjust the size to match the previous div
            />
          }
        >
          <div className="flex flex-col items-center -mt-16 mb-4">
            <Avatar
              size={110}
              src={user.profilePicture || defaultProfileImage} // Fallback for profile picture
              icon={<UserOutlined />}
              className="border-4 border-white"
            />
            <Title level={4} className="mt-4">
              {user.name}
            </Title>
          </div>

          <Descriptions bordered>
            <Descriptions.Item
              label={
                <Space>
                  <MailOutlined />
                  Email
                </Space>
              }
              span={3}
            >
              {user.email}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <BankOutlined /> Bio
                </Space>
              }
              span={3}
            >
              {user.industry}
            </Descriptions.Item>
          </Descriptions>

          <Form
            form={form}
            onFinish={handleUpdate}
            layout="vertical"
            className="mt-6"
          >
            <Form.Item name="profilePicture" label="Profile Picture">
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
            <Form.Item
              name="fullName"
              label="Full Name"
              initialValue={user.name}
            >
              <Input />
            </Form.Item>
            <Form.Item name="bio" label="Bio" initialValue={user.bio}>
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Profile
              </Button>
              <Button onClick={handleModalClose} style={{ marginLeft: 8 }}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default ProfileCard;
