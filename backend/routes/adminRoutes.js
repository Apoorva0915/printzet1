import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to check admin role
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ GET all users (Admin Only)
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password but include everything else
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});


// ✅ GET all orders (Admin Only)
// ✅ GET all orders (Admin Only)
router.get("/orders", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate("userId categoryId");

    // Return Cloudinary URLs instead of local file paths
    const ordersWithCloudinaryLinks = orders.map(order => ({
      ...order.toObject(),
      filePaths: order.filePaths, // These should already be Cloudinary URLs
    }));

    res.json(ordersWithCloudinaryLinks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

  

// ✅ Update order status (Admin Only)
router.put("/orders/:orderId", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status || order.status;
    await order.save();
    
    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
});

export default router;
