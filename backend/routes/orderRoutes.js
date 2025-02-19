import express from "express";
import Order from "../models/Order.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Category from "../models/Category.js";


const router = express.Router();

// Place an order
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { numCopies, colorType, categoryId } = req.body;
    const userId = req.user.id; // Extract user ID from JWT token
    const filePath = req.file.path;

    // Fetch category details
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Calculate total cost
    const baseCost = category.costPerCopy;
    const costMultiplier = colorType === "color" ? 2 : 1; // Color costs 2x
    const totalCost = numCopies * baseCost * costMultiplier;

    // Save order to DB
    const newOrder = new Order({
      userId,
      categoryId,
      filePath,
      numCopies,
      colorType,
      totalCost,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", order: newOrder });

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
