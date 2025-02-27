import express from "express";
import Order from "../models/Order.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import url from "url";


const router = express.Router();

// Function to count pages

// Configure Cloudinary (Make sure your .env file has these variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const countPages = async (file) => {
  try {
    let dataBuffer;

    if (file.path.startsWith("http")) {
      // ✅ Construct the direct Cloudinary URL (skip API lookup)
      const fileUrl = file.path.replace("/upload/", "/upload/fl_attachment/"); 

      console.log(`✅ Fetching file from Cloudinary URL: ${fileUrl}`);

      // ✅ Fetch the file securely
      const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
      dataBuffer = Buffer.from(response.data);
    } else {
      // ✅ Read the file locally (fallback)
      dataBuffer = fs.readFileSync(file.path);
    }

    // ✅ Handle PDFs
    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(dataBuffer);
      return data.numpages;
    }

    // ✅ Handle DOCX files
    if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      return result.value.split("\n\n").length; // Estimate pages
    }

    return 1; // Default for unsupported formats
  } catch (error) {
    console.error("❌ Error counting pages:", error);
    return 1;
  }
};



// Place an order
router.post("/", authMiddleware, upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const { numCopies, colorType, categoryId } = req.body;
    const userId = req.user.id;

    // Get file URLs from Cloudinary
    const fileUrls = req.files.map(file => file.path); // Cloudinary stores URLs in `file.path`

    // Calculate total pages
    let totalPages = 0;
    for (const file of req.files) {
      totalPages += await countPages(file);
    }

    // Calculate total cost
    const category = await Category.findById(categoryId);
    const baseCost = category.costPerCopy;
    const costMultiplier = colorType === "color" ? 2 : 1;
    const totalCost = totalPages * numCopies * baseCost * costMultiplier;

    // Save order in DB with Cloudinary file URLs
    const newOrder = new Order({
      userId,
      categoryId,
      filePaths: fileUrls, // Store URLs instead of local paths
      numCopies,
      colorType,
      totalCost,
      totalPages,
    });

    await newOrder.save();

    res.status(200).json({ message: "Order placed successfully", totalPages });
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
