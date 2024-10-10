import React, { useEffect, useState } from "react";
import { Card, Button, Input, Modal } from "antd";
import axios from "axios";

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    price: 0,
    category: "",
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("/api/marketplace");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    try {
      await axios.post("/api/marketplace", newItem);
      setIsModalOpen(false);
      // Fetch items again to refresh list
      const response = await axios.get("/api/marketplace");
      setItems(response.data);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add New Item
      </Button>
      <Modal
        title="Add New Item"
        visible={isModalOpen}
        onOk={handleAddItem}
        onCancel={() => setIsModalOpen(false)}
      >
        <Input
          placeholder="Title"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
        />
        <Input
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <Input
          placeholder="Category"
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
        />
      </Modal>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
        {items.map((item) => (
          <Card
            key={item._id}
            title={item.title}
            extra={<Button type="link">Message Seller</Button>}
            style={{ width: 300 }}
          >
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <p>Category: {item.category}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
