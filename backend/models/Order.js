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
    filePaths: {
      type: [String],
      required: true,
    },
    numCopies: {
      type: Number,
      required: true,
      min: 1,
    },
    colorType: {
      type: String,
      enum: ["blackWhite", "color"],
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    totalPages: {
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

// ✅ Ensure no duplicate indexes
OrderSchema.index({ userId: 1, categoryId: 1 });

const Order = mongoose.model("Order", OrderSchema);
export default Order;
