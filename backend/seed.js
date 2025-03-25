// Updated seed.js with merged categories
import mongoose from "mongoose";
import Category from "./models/Category.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

const categories = [
  {
    id: "document-printing",
    name: "Document Printing",
    description: "High-quality printing for documents, books, visiting cards, certificates, letterheads, and posters.",
    paperSize: "A4, A3, Custom Sizes",
    costPerCopy: new Map([
      ["document", 5],
      ["visiting-card", 2],
      ["book", 15],
      ["letterhead", 8],
      ["certificate", 10],
      ["poster", 20],
    ]),
    image: "https://res.cloudinary.com/di3caz3zz/image/upload/v1740146868/printEcom/docPrintjpg_i2y7cx.jpg",
  },
  {
    id: "accessory-printing",
    name: "Accessory Printing",
    image: "https://res.cloudinary.com/di3caz3zz/image/upload/v1742808006/printEcom/accesory-print_peuj1p.jpg",
    description: "Custom-printed T-shirts, coffee mugs, and personalized gifts.",
    cost: 599,
  },
  {
    id: "3d-printing",
    name: "3D Printing",
    image: "https://res.cloudinary.com/di3caz3zz/image/upload/v1742808007/printEcom/3d-pront_fdknyg.webp",
    description: "Upload your 3D design and get it printed with precision.",
    dynamicPricing: true,
  },
  {
    id: "3d-infra-design",
    name: "3D Infra Design",
    image: "https://res.cloudinary.com/di3caz3zz/image/upload/v1742808006/printEcom/3d-infra_q6rbjn.webp",
    description: "Request a professional 3D infrastructure design tailored to your needs.",
    dynamicPricing: true,
  },
];

const seedDB = async () => {
  try {
    await Category.deleteMany({});
    console.log("Existing categories deleted.");
    
    await Category.insertMany(categories);
    console.log("Database Seeded Successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
  }
};

seedDB();
