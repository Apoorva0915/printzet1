import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import userData from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/payment.js";


dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files
app.use("/api/payment", paymentRoutes);

// Routes
app.use("/api/auth", userRoutes, authRoutes, userData);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
