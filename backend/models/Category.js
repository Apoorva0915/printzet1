import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  paperSize: { type: String, required: true },
  costPerCopy: { type: Number, required: true },
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
