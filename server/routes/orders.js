const express = require("express");
const Order = require("../models/Order");
const protect = require("../middleware/auth");
const router = express.Router();

// Place order
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items in order" });

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      address,
      paymentStatus: "paid", // mocked
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my orders
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name image");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
