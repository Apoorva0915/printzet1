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
import createAdminUser from "./utils/createAdminUser.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();

app.use(cors({ origin: '*' }));
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Allow frontend origin
//     credentials: true, // Allow cookies and authentication headers
//   })
// );

app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files
app.use("/api/payment", paymentRoutes);

// Routes
app.use("/api/auth", userRoutes, authRoutes, userData);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB Connection

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await createAdminUser(); // Create the admin user if not exists
  })
  .catch((err) => console.error("MongoDB Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
