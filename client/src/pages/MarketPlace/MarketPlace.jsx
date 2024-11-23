import React, { useEffect, useState } from "react";
import { Card, Button, Input, Modal, Form, Upload, Select, Pagination, AutoComplete } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useUserContext } from "../../hooks/useUserContext";
import { Navigate, useNavigate } from "react-router-dom";

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUserContext();
  const [image, setImage] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  console.log("searchTerm :", searchTerm);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [itemsPerPage] = useState(12); // Items per page
  const [selectedCategory, setSelectedCategory] = useState(""); // Category filter
  const [suggestions, setSuggestions] = useState([]); // For search suggestions
  const navigate = useNavigate();

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    price: 0,
    category: "",
  });
  console.log("newItem :", newItem);
  const [form] = Form.useForm();
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `${process.env.SERVER_URL}/api/market/items`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        console.log("items res :", response);
        setItems(response.data.data);
        setAllItems(response.data.data); // Save all items

      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    
    if (!value) {
      // If the search term is cleared, show all items again
      setItems(allItems);
      setSuggestions([]); // Clear suggestions
    } else {
      const filteredItems = allItems.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      setItems(filteredItems);
      // Set suggestions for dropdown
      setSuggestions(
        filteredItems.map((item) => ({
          value: item.title,
          id: item._id, // Assuming each item has a unique _id
        }))
      );
    }
  };

  // When user selects a suggestion, redirect to the single product page
  const onSelectSuggestion = (value, option) => {
    navigate(`/product/${option.id}`); // Navigate to product detail page
  };

  const handleFilterChange = (value) => {
    setSelectedCategory(value);
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

  const handleModalClose = () => {
    form.resetFields();
    setImage(null);
    setIsModalOpen(false);
  };

  const handleAddItem = async () => {
    try {
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
        return;
      }
      console.log(response);

      setItems(items.concat(response.data.data));
      console.log("items after update :", items);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding item:", error);
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
      console.log(response);
      setItems(items.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add New Item
      </Button>
      <AutoComplete
        style={{ width: 300 }}
        value={searchTerm}
        onChange={handleSearch}
        options={suggestions} // Show suggestions
        onSelect={onSelectSuggestion} // Handle suggestion selection
        placeholder="Search for items"
      >
        <Input.Search enterButton="Search" onSearch={handleSearch} />
      </AutoComplete>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        {/* <Input.Search
          placeholder="Search for items"
          enterButton="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
          style={{ width: "300px" }} // Adjusted width
        /> */}

        <Select
          placeholder="Filter by category"
          onChange={handleFilterChange}
          style={{ width: "200px" }}
         
        >
          <Select.Option value="">All</Select.Option>
          <Select.Option value="Hardware">Hardware</Select.Option>
          <Select.Option value="Gaming Skin">Gaming Skin</Select.Option>
          <Select.Option value="GPU">GPU</Select.Option>
          <Select.Option value="Others">Others</Select.Option>
        </Select>
      </div>
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
            initialValue={user.bio}
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
            <Button type="primary" htmlType="submit">
              Add Item
            </Button>
            <Button onClick={handleModalClose} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {items.map((item) => (
          <Card
            key={item._id}
            title={item.title}
            extra={<Button type="link">Message Seller</Button>}
            style={{ width: 300 }}
            cover={
              <img
                src={item.imageUrl || "https://via.placeholder.com/300"}
                alt="Cover"
                style={{ width: "100%", height: "180px", objectFit: "cover" }} // Adjust the size to match the previous div
              />
            }
            actions={[
              user._id === item.seller && (
                <Button
                  type="danger"
                  onClick={() => handleDeleteItem(item._id)}
                >
                  Delete
                </Button>
              ),
            ]}
          >
            <p>{item.description}</p>
            <p>Price: {item.price} pkr</p>
            <p>Category: {item.category}</p>
          </Card>
        ))}
      </div>
        {/* Pagination */}
        <Pagination
        current={currentPage}
        pageSize={itemsPerPage}
        total={items.length}
        onChange={handlePageChange}
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default Marketplace;
