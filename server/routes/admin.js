const express = require("express");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const router = express.Router();

router.use(protect, adminOnly);

// ── Products ──────────────────────────────────────
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Orders ──────────────────────────────────────
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Stats ──────────────────────────────────────
router.get("/stats", async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, orders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Order.find(),
    ]);
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    res.json({ totalProducts, totalOrders, totalUsers, totalRevenue });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
