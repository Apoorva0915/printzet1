import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// Fetch all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
});

// Fetch a category by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ id });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
});

export default router;
