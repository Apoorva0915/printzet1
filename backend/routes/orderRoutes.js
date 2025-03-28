import express from "express";
import Order from "../models/Order.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Category from "../models/Category.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import axios from "axios";

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
        console.error("Error counting pages:", error);
        return 1;
    }
};

router.post("/", authMiddleware, upload.array("files", 10), async (req, res) => {
    try {
        console.log("Received Order Data:", req.body);
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }
        const { numCopies, colorType, categoryId, subCategory, paperType, printQuality, printedSide, binding, lamination, coverPage } = req.body;
        const userId = req.user.id;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({ message: "Invalid category" });
        }
        // console.log("Category Retrieved:", category);

        if (category.name.toLowerCase() === "document printing") {
            if (!subCategory || !category.costPerCopy[subCategory]) {
                return res.status(400).json({
                    message: "Invalid or missing subcategory selection",
                    validSubCategories: Object.keys(category.costPerCopy),
                });
            }
        }

        const subCategoryCost = category.costPerCopy[subCategory] || {};
        if (!subCategoryCost) {
            return res.status(400).json({ message: "Invalid subcategory cost" });
        }

        if (!category.paperTypes[paperType]) {
            return res.status(400).json({ message: "Invalid paper type", validPaperTypes: Object.keys(category.paperTypes) });
        }

        if (!category.printQualities[printQuality]) {
            return res.status(400).json({ message: "Invalid print quality", validPrintQualities: Object.keys(category.printQualities) });
        }

        if (!category.printedSides[printedSide]) {
            return res.status(400).json({ message: "Invalid printed side", validPrintedSides: Object.keys(category.printedSides) });
        }

        if (binding && !category.bindingOptions[binding]) {
            return res.status(400).json({ message: "Invalid binding option", validBindings: Object.keys(category.bindingOptions) });
        }

        if (lamination && !category.laminationOptions[lamination]) {
            return res.status(400).json({ message: "Invalid lamination option", validLaminations: Object.keys(category.laminationOptions) });
        }

        if (coverPage && !category.coverPages[coverPage]) {
            return res.status(400).json({ message: "Invalid cover page", validCoverPages: Object.keys(category.coverPages) });
        }

        let totalPages = 0;
        let uploadedFiles = [];

        for (const file of req.files) {
            const cloudinaryUpload = await cloudinary.uploader.upload(file.path, { resource_type: "raw" });
            uploadedFiles.push(cloudinaryUpload.secure_url);
            totalPages += await countPages(file);
        }

        const pageCost = subCategoryCost[paperType]?.[printedSide] || 0;
        const colorMultiplier = colorType === "color" ? 2 : 1;
        const totalCost = totalPages * numCopies * pageCost * colorMultiplier;

        if (isNaN(totalCost) || totalCost <= 0) {
            return res.status(400).json({ message: "Invalid total cost calculation" });
        }

        console.log("Total Pages:", totalPages);
        console.log("Total Cost:", totalCost);

        const newOrder = new Order({
            userId,
            categoryId,
            subCategory,
            filePaths: uploadedFiles,
            numCopies,
            colorType,
            paperType,
            printQuality,
            printedSide,
            binding,
            lamination,
            coverPage,
            totalCost,
            totalPages,
        });

        await newOrder.save();
        res.status(200).json({ message: "Order placed successfully", totalPages, totalCost });
    } catch (error) {
        console.error("Order Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;