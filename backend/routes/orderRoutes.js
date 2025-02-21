import express from "express";
import Order from "../models/Order.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";

const router = express.Router();

// Place an order
router.post("/", authMiddleware, upload.array("files", 10), async (req, res) => {
  try {
    console.log("Order Request Received:", req.body);
    console.log("Uploaded Files:", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const { numCopies, colorType, categoryId } = req.body;
    const userId = req.user.id;

    // Validate categoryId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      console.error("Received invalid categoryId:", categoryId);
      return res.status(400).json({ message: "Invalid categoryId format. Expected MongoDB ObjectId." });
    }
    
    console.log("Received categoryId:", categoryId);

    const category = await Category.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // File paths
    const filePaths = req.files.map((file) => file.path.replace(/\\/g, "/"));

    // Calculate total cost
    const baseCost = category.costPerCopy;
    const costMultiplier = colorType === "color" ? 2 : 1;
    const totalCost = numCopies * baseCost * costMultiplier * filePaths.length;

    // Save order to DB
    const newOrder = new Order({
      userId,
      categoryId,
      filePaths, // Store array of file paths
      numCopies,
      colorType,
      totalCost,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);  // Send the full saved order
    

  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});




// Get orders for a user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("categoryId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

// Get a single order by ID
router.get("/:orderId", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("categoryId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
});




export default router;
