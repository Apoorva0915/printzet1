import express from "express";
import Order from "../models/Order.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

const router = express.Router();

// Function to count pages
const countPages = async (file) => {
  if (file.mimetype === "application/pdf") {
    const dataBuffer = fs.readFileSync(file.path);
    const data = await pdfParse(dataBuffer);
    return data.numpages;
  } else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const dataBuffer = fs.readFileSync(file.path);
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    return result.value.split("\n\n").length; // Estimate pages based on paragraphs
  }
  return 1; // Default to 1 page for unsupported formats
};

// Place an order
router.post("/", authMiddleware, upload.array("files", 10), async (req, res) => {
  try {
    console.log("Order Request Received:", req.body);
    console.log("Uploaded Files:", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const { numCopies, colorType, categoryId } = req.body;

    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid categoryId format." });
    }
    
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid categoryId format." });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Calculate total pages
    let totalPages = 0;
    const filePaths = [];
    for (const file of req.files) {
      const pages = await countPages(file);
      totalPages += pages;
      filePaths.push(file.path.replace(/\\/g, "/"));
    }

    // Calculate total cost based on pages
    const baseCost = category.costPerCopy;
    const costMultiplier = colorType === "color" ? 2 : 1;
    const totalCost = totalPages * numCopies * baseCost * costMultiplier;

    // Send response to frontend with totalPages
    res.status(200).json({
      message: "Files uploaded successfully",
      totalPages,
    });

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
