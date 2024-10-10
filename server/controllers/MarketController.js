const MarketplaceItem = require("../models/marketModel");

createItem = async (req, res) => {
  try {
    const newItem = new MarketplaceItem({
      ...req.body,
      seller: req.user._id, // assuming req.user has authenticated user
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

getItems = async (req, res) => {
  try {
    const items = await MarketplaceItem.find().populate("seller", "name");
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

updateItem = async (req, res) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(item, req.body);
    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

deleteItem = async (req, res) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await item.deleteOne();
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
    createItem,
    getItems,
    updateItem,
    deleteItem,
    };
