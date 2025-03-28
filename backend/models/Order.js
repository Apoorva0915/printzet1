import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    paperType: {
      type: String,
    },
    printQuality: {
      type: String,
    },
    binding: {
      type: String,
    },
    lamination: {
      type: String,
    },
    filePaths: {
      type: [String], // ✅ Stores Cloudinary URLs
      required: true,
    },
    numCopies: {
      type: Number,
      required: true,
      min: 1,
    },
    colorType: {
      type: String,
      enum: ["blackWhite", "color"], // ✅ Ensures only valid values
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
