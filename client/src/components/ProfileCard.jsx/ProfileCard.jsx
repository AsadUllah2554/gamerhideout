import React, { useState } from "react";
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

const ProfileCard = () => {
  const { user, setUser, logout } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleUpdate = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.fullName);
      formData.append("bio", data.bio);
      if (profileImage) formData.append("profilePicture", profileImage);
      if (coverImage) formData.append("coverPicture", coverImage);

      const response = await axios.patch(
        `${process.env.SERVER_URL}auth/profile/${user._id}`,
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
  return (
    <div className="ProfileCard">
      <div className="hidden md:block">
        <Card
          className="mb-6 overflow-hidden"
          cover={
            <img
              src={user.coverPicture || defaultCoverImage}
              alt="Cover"
              style={{ width: "100%", height: "120px", objectFit: "cover" }} // Adjust the size to match the previous div
            />
          }
        >
          <div className="text-center relative">
            <Avatar
              size={100}
              icon={<UserOutlined />}
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 border-4 border-white"
              src={user.profilePicture || defaultProfileImage}
            />
          </div>
          <div className="mt-8 text-center">
            <h2 className="text-xl font-bold mt-4">{user.name}</h2>
            <p className="text-gray-600">{user.bio}</p>
            <div className="mt-4 flex justify-around">
              <div>
                <strong>{user.postCount > 0 ? user.postCount : 0}</strong>
                <p className="text-gray-600">Posts</p>
              </div>
              <div>
                <strong>{user.friends > 0 ? user.friends : 0}</strong>
                <p className="text-gray-600">Friends</p>
              </div>
            </div>
            <span onClick={handleModalOpen} className="profileBtn ">
              My Profile
            </span>
            <button className=" r-button align-middle" onClick={logout}>
              Logout
            </button>
          </div>
        </Card>
      </div>

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
                  <MailOutlined />
                  Username
                </Space>
              }
              span={3}
            >
              {user.username}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <BankOutlined /> Bio
                </Space>
              }
              span={3}
            >
              {user.bio}
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
