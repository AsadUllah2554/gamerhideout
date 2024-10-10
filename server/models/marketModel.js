const mongoose = require("mongoose");

const marketplaceItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["GPU", "Gaming Skin", "Hardware", "Others"],
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageUrl: {
    type: String,
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MarketplaceItem", marketplaceItemSchema);
