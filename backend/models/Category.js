// Updated Category.js to store costPerCopy as a Map
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  paperSize: { type: String },
  costPerCopy: { 
    type: Map, 
    of: Number,
    default: {},
  },
  image: { type: String },
});

const Category = mongoose.model("Category", categorySchema);
export default Category;