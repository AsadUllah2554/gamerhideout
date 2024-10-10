import { useState } from "react";
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
import { userAPI } from "@/services";

const { Title } = Typography;

const Profile = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  if (!user) {
    return;
  }

  const showModal = (type) => {
    setModalType(type);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (data) => {
    if (modalType === "updateProfile") {
      const profileData = {
        firstName: data.firstName,
        lastName: data.lastName,
        image: "uuid",
      };
      const res = await userAPI.updateProfile(profileData);
      if (res.error) {
        message.error(res.error.message);
        return;
      }

      dispatch(userActions.init(res.data.data));
      message.success("Profile updated successfully");
    } else if (modalType === "changePassword") {
      const passwordData = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };
      const res = await userAPI.updatePassword(passwordData);
      if (res.error) {
        message.error(res.error.message);
        return;
      }
      message.success("Password changed successfully");
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div className=" min-h-full py-12 px-4 h-80 rounded-lg overflow-hidden ">
      <Card
        className="max-w-3xl mx-auto  bg-white shadow-md"
        cover={<div style={{ height: 120, background: "#00eebc" }} />}
      >
        <div className="flex flex-col items-center -mt-16 mb-4">
          <Avatar
            size={128}
            icon={<UserOutlined />}
            className="border-4 border-white"
            style={{ backgroundColor: "#f56a00", opacity: 1 }}
          />
          <Title level={2} className="mt-4">
            {user.firstName} {user.lastName}
          </Title>
        </div>

        <Descriptions bordered>
          <Descriptions.Item
            label={
              <Space>
                <MailOutlined /> Email
              </Space>
            }
            span={3}
          >
            {user.email}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <BankOutlined /> Industry
              </Space>
            }
            span={3}
          >
            {user.industry}
          </Descriptions.Item>
        </Descriptions>
        <div className="mt-6 flex justify-center">
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => showModal("updateProfile")}
              style={{
                backgroundColor: "#00eebc",
                borderColor: "#00eebc",
                color: "#000000",
              }}
            >
              Update Profile
            </Button>
            <Button
              onClick={() => showModal("changePassword")}
              style={{
                backgroundColor: "#ffffff",
                borderColor: "#00eebc",
                color: "#000000",
              }}
            >
              Change Password
            </Button>
          </Space>
        </div>
      </Card>

      <Modal
        title={
          modalType === "updateProfile" ? "Update Profile" : "Change Password"
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          {modalType === "updateProfile" && (
            <>
              <Form.Item name="avatar" label="Profile Picture">
                <Upload>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item
                name="firstName"
                label="First Name"
                initialValue={user.firstName}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="lastName"
                label="Last Name"
                initialValue={user.lastName}
              >
                <Input />
              </Form.Item>
            </>
          )}
          {modalType === "changePassword" && (
            <>
              <Form.Item
                name="oldPassword"
                label="Old Password"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                rules={[
                  { required: true },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {modalType === "updateProfile"
                ? "Update Profile"
                : "Change Password"}
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
