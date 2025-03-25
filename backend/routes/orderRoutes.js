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

const router = express.Router();

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Function to count pages
const countPages = async (file) => {
  try {
    let dataBuffer;

    if (file.path.startsWith("http")) {
      const response = await axios.get(file.path, { responseType: "arraybuffer" });
      dataBuffer = Buffer.from(response.data);
    } else {
      dataBuffer = fs.readFileSync(file.path);
    }

    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(dataBuffer);
      return data.numpages;
    }

    if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      return result.value.split("\n\n").length;
    }

    return 1;
  } catch (error) {
    console.error("❌ Error counting pages:", error);
    return 1;
  }
};

// ✅ Place an Order
router.post("/", authMiddleware, upload.array("files", 10), async (req, res) => {
  try {
    console.log("🟢 Received Order Data:", req.body);
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const { numCopies, colorType, categoryId, subCategory } = req.body;
    const userId = req.user.id;

    // ✅ Fetch Category
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: "Invalid category" });
    }

    console.log("📌 Category Retrieved:", category);

    // ✅ Convert costPerCopy (Map → Object)
    const costPerCopy = category.costPerCopy instanceof Map
      ? Object.fromEntries(category.costPerCopy)
      : category.costPerCopy;

    console.log("💰 Category Cost Map:", costPerCopy);

    // ✅ Ensure subCategory is provided for "Document Printing"
    if (category.name.toLowerCase() === "document printing") {
      if (!subCategory) {
        return res.status(400).json({ message: "Subcategory is required for document printing" });
      }
      if (!costPerCopy[subCategory]) {
        return res.status(400).json({
          message: "Invalid subcategory selection",
          validSubCategories: Object.keys(costPerCopy),
        });
      }
    }

    const subCategoryCost = costPerCopy[subCategory] || 0;
    if (!subCategoryCost) {
      return res.status(400).json({ message: "Invalid subcategory cost" });
    }

    let totalPages = 0;
    let uploadedFiles = [];

    // ✅ Upload to Cloudinary & count pages
    for (const file of req.files) {
      const cloudinaryUpload = await cloudinary.uploader.upload(file.path, { resource_type: "raw" });
      uploadedFiles.push(cloudinaryUpload.secure_url);
      totalPages += await countPages(file);
    }

    // ✅ Calculate Total Cost
    const totalCost = totalPages * numCopies * subCategoryCost * (colorType === "color" ? 2 : 1);

    if (isNaN(totalCost) || totalCost <= 0) {
      return res.status(400).json({ message: "Invalid total cost calculation" });
    }

    console.log("📄 Total Pages:", totalPages);
    console.log("💲 Total Cost:", totalCost);

    // ✅ Save Order in Database
    const newOrder = new Order({
      userId,
      categoryId,
      subCategory,
      filePaths: uploadedFiles,
      numCopies,
      colorType,
      totalCost,
      totalPages,
    });

    await newOrder.save();
    res.status(200).json({ message: "✅ Order placed successfully", totalPages, totalCost });
  } catch (error) {
    console.error("❌ Order Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
