import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
});

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    resetToken: { type: String, default: null },
    tokenExpiry: { type: Date, default: null },
    address: addressSchema, // Added address field
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
