import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Input,
  Modal,
  Form,
  Upload,
  Select,
  Pagination,
  AutoComplete,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useUserContext } from "../../hooks/useUserContext";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import backgroundImage from "../../assets/images/hero.png";
import {
  HeartOutlined,
  ShareAltOutlined,
  HomeOutlined,
  MessageOutlined,
  ShoppingOutlined,
  SettingOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { Tag, Dropdown, Menu, Avatar } from "antd";
import { PostSkeletonList } from "../../components/Skeleton/Skeleton";
import { FeatureUnderDevelopmentModal } from "../../components/UnderDevelopment/FeatureUnderDevelopment";

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ownListing, setOwnListing] = useState(false);

  // Modal and Form States
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter States
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useUserContext();
  const [form] = Form.useForm();
  const [image, setImage] = useState(null);


  const [isModalOpen, setIsModalOpen] = useState(false);


  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [itemsPerPage] = useState(12); // Items per page
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);

  const categories = [
    "Skins",
    "Weapons",
    "Characters",
    "Accessories",
    "Emotes",
    "Battle Passes",
  ];

  const filteredItems = allItems.filter(
    (item) =>
      (!selectedGame ||
        selectedGame === "All Games" ||
        item.game === selectedGame) &&
      (!selectedCategory || item.category === selectedCategory)
  );

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    price: 0,
    category: "",
  });
 

  useEffect(() => {
    setLoading(true);
    const fetchItems = async () => {
      try {
        const [allItemsResponse, userItemsResponse] = await Promise.all([
          axios.get(`${process.env.SERVER_URL}/api/market/items`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axios
            .get(`${process.env.SERVER_URL}/api/market/items/${user._id}`, {
              headers: { Authorization: `Bearer ${user.token}` },
            })
            .catch((error) => {
              // If there's an error fetching user items (e.g., no items), return an empty array
              if (error.response && error.response.status === 404) {
                return { data: { data: [] } };
              }
              // Rethrow other types of errors
              throw error;
            }),
        ]);
    
        setItems(allItemsResponse.data.data);
        setAllItems(allItemsResponse.data.data);
        setUserItems(userItemsResponse.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching items:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleSearch = (e) => {

    setSearchTerm(e.target.value);

    if (!e.target.value) {
      setItems(allItems);
    } else {
      const filteredItems = allItems.filter((item) =>
        item.title.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setItems(filteredItems);
    }
  };

  const handleFilterChange = (value) => {

    setSelectedCategory(value);

    if (value) {
      const filteredItems = allItems.filter((item) =>
        item.category.toLowerCase().includes(value.toLowerCase())
      );
      setItems(filteredItems);
    } else {
      setItems(allItems);
    }
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items
    .filter((item) =>
      selectedCategory ? item.category === selectedCategory : true
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleImageChange = (info) => {
    const selectedFile = info.file.originFileObj || info.file;
    if (selectedFile) {
      setImage(selectedFile);
    }
  };

  const handleUpdate = async (data) => {
    try {
      // Create form data for backend multer upload
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("bio", data.bio);
      if (image) formData.append("image", image);

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

  const handleModalClose = () => {
    form.resetFields();
    setImage(null);
    setIsModalOpen(false);
  };

  const handleAddItem = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", newItem.title);
      formData.append("description", newItem.description);
      formData.append("price", newItem.price);
      formData.append("category", newItem.category);
      formData.append("seller", user._id);
      if (image) formData.append("image", image);

      const response = await axios.post(
        `${process.env.SERVER_URL}/api/market`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.error) {
        message.error(response.data.error.message);
        setLoading(false);
        return;
      }


      setItems((prevItems) => [response.data.data, ...prevItems]);
      setAllItems((prevItems) => [response.data.data, ...prevItems]);
  
      setIsModalOpen(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error adding item:", error);
    }finally{
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await axios.delete(
        `${process.env.SERVER_URL}/api/market/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.data.error) {
        message.error(response.data.error.message);
        return;
      }
 
      setItems(items.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const renderUserListings = () => (
    <Card title="My Listings">
      {userItems.length === 0 ? (
        <p className="text-center text-gray-500">No current listings</p>
      ) : (
        <>
          {userItems.map((item) => (
            <Card
              key={item._id}
              cover={
                <img
                  alt={item.title}
                  src={item.imageUrl}
                  className="h-48 object-cover"
                />
              }
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={() => {
                    setSelectedItem(item);
                    form.setFieldsValue({
                      title: item.title,
                      description: item.description,
                      price: item.price,
                      category: item.category,
                    });
                    setIsEditItemModalOpen(true);
                  }}
                />,
                <DeleteOutlined
                  key="delete"
                  onClick={() => handleDeleteItem(item._id)}
                />,
              ]}
            >
              <Card.Meta
                title={item.title}
                description={
                  <div>
                    <div className="flex justify-between">
                      <span>{item.category}</span>
                      <Tag color="blue">${item.price}</Tag>
                    </div>
                  </div>
                }
              />
            </Card>
          ))}
        </>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Background Overlay */}

      <div
        className="absolute inset-0 opacity-5 bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundPosition: "right center",
        }}
      />
      {/* Top Navbar */}
      <Navbar title={"Gamers Hideout Marketplace"} />

      <div className="container mx-auto pt-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="hidden md:block">
            <Card title="Filters" className="mb-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Category</h3>
                  <Select
                    placeholder="Filter by category"
                    onChange={handleFilterChange}
                    style={{ width: "100%" }}
                  >
                    <Select.Option value="">All</Select.Option>
                    <Select.Option value="Hardware">Hardware</Select.Option>
                    <Select.Option value="Gaming Skin">
                      Gaming Skin
                    </Select.Option>
                    <Select.Option value="GPU">GPU</Select.Option>
                    <Select.Option value="Others">Others</Select.Option>
                  </Select>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Price Range</h3>
                  <div className="flex space-x-2">
                    <Input placeholder="Min" type="number" />
                    <Input placeholder="Max" type="number" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Marketplace Items */}
          <div className="md:col-span-2">
            <div className="mb-6 flex space-x-4">
              <Input
                placeholder="Search items, games, sellers"
                prefix={<SearchOutlined />}
                className="flex-grow"
                onChange={handleSearch}
              />
              <Button
                icon={<FilterOutlined />}
                onClick={() => setIsFilterModalVisible(true)}
                className="md:hidden"
              >
                Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loading ? (
                <PostSkeletonList count={6} />
              ) : !ownListing ? (
                items.map((item) => (
                  <Card
                    key={item._id}
                    hoverable
                    onClick={() => handleItemClick(item)}
                    cover={
                      <div className="h-48 overflow-hidden">
                        <img
                          alt={item.title}
                          src={item.imageUrl}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    }
                    actions={[
                      <HeartOutlined key="wishlist" />,
                      <ShareAltOutlined key="share" />,
                    ]}
                  >
                    <Card.Meta
                      title={item.title}
                      description={
                        <div>
                          <div className="flex justify-between">
                            <span>{item.category}</span>
                            <Tag color="blue">${item.price}</Tag>
                          </div>
                          <div className="text-gray-500 text-sm mt-1">
                            Seller: {item.seller.name}
                          </div>
                        </div>
                      }
                    />
                  </Card>
                ))
              ) : (
                renderUserListings()
              )}
            </div>
          </div>

          {/* Trending & User Listings */}
          <div className="hidden md:block">
            <Card title="Trending Items" className="mb-6">
              <div className="space-y-4">
                {items.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center">
                      <Avatar
                        shape="square"
                        src={item.imageUrl}
                        size={50}
                        className="mr-4"
                      />
                      <div>
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-gray-500 text-sm">
                          {item.category}
                        </div>
                      </div>
                    </div>
                    <Tag color="green">${item.price}</Tag>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="My Listings">
              <Button
                type="primary"
                className="w-full mb-4"
                onClick={setIsModalOpen}
              >
                Create New Listing
              </Button>
              <Button
                type="default"
                className="w-full mb-4"
                onClick={() => setOwnListing(!ownListing)}
              >
                {ownListing ? "View all listings" : "View my listings"}
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      <Modal
        title="Item Details"
        open={!!selectedItem}
        onCancel={() => setSelectedItem(null)}
        footer={[
          <Button key="chat" type="primary" onClick={setIsFeatureModalOpen}>
            Chat with Seller
          </Button>,
        ]}
      >
        {selectedItem && (
          <div>
            <img
              src={selectedItem.imageUrl}
              alt={selectedItem.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
              <div className="flex justify-between">
                <span>Game: {selectedItem.game}</span>
                <Tag color="blue" className="text-lg">
                  ${selectedItem.price}
                </Tag>
              </div>
              <div>Category: {selectedItem.category}</div>
              <div>Condition: {selectedItem.condition}</div>
              <div>Seller: {selectedItem.seller.name}</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Mobile Filters Modal */}
      <Modal
        title="Marketplace Filters"
        open={isFilterModalVisible}
        onCancel={() => setIsFilterModalVisible(false)}
        footer={[
          <Button
            key="reset"
            onClick={() => {
              setSelectedGame(null);
              setSelectedCategory(null);
              setIsFilterModalVisible(false);
            }}
          >
            Reset Filters
          </Button>,
          <Button
            key="apply"
            type="primary"
            onClick={() => setIsFilterModalVisible(false)}
          >
            Apply Filters
          </Button>,
        ]}
      >
        <div className="space-y-4">
          {/* <div>
            <h3 className="font-semibold mb-2">Game</h3>
            <Select
              style={{ width: "100%" }}
              placeholder="Select Game"
              onChange={(value) => setSelectedGame(value)}
            >
              {games.map((game) => (
                <Select.Option key={game} value={game}>
                  {game}
                </Select.Option>
              ))}
            </Select>
          </div> */}

          <div>
            <h3 className="font-semibold mb-2">Category</h3>
            <Select
              style={{ width: "100%" }}
              placeholder="Select Category"
              onChange={(value) => setSelectedCategory(value)}
            >
              {categories.map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Price Range</h3>
            <div className="flex space-x-2">
              <Input placeholder="Min Price" type="number" />
              <Input placeholder="Max Price" type="number" />
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="Post Item"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        className=" -mt-20"
      >
        <Form
          form={form}
          onFinish={handleAddItem}
          layout="vertical"
          className="mt-6"
        >
          <Form.Item name="image" label="Item image">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              onChange={handleImageChange}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="title" label="Title" initialValue={newItem.title}>
            <Input
              placeholder="Title"
              value={newItem.title}
              onChange={(e) =>
                setNewItem({ ...newItem, title: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            value={newItem.description}
          >
            <Input
              placeholder="Description "
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item name="price" label="Price" initialValue={newItem.price}>
            <Input
              placeholder="Price "
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            initialValue={newItem.category}
          >
            <Select
              initialValue="Hardware"
              style={{
                width: 120,
              }}
              options={[
                {
                  value: "Others",
                  label: "Others",
                },
                {
                  value: "Hardware",
                  label: "Hardware",
                },
                {
                  value: "Gaming Skin",
                  label: "Gaming Skin",
                },
                {
                  value: "GPU",
                  label: "GPU",
                },
              ]}
              onChange={(value) => setNewItem({ ...newItem, category: value })}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading}>
              Post Item
            </Button>
            <Button onClick={handleModalClose} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <FeatureUnderDevelopmentModal
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
        featureName="Messaging"
        additionalDetails="Real-time messaging is coming soon! We're working on providing a seamless communication experience."
      />
    </div>
  );
};

export default Marketplace;

//   <Pagination
//   current={currentPage}
//   pageSize={itemsPerPage}
//   total={items.length}
//   onChange={handlePageChange}
//   style={{ marginTop: "20px" }}
// />
// </div>
