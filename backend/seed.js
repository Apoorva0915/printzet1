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
    description: "High-quality document printing with various paper sizes and formats.",
    paperSize: "A4, A3",
    costPerCopy: 5,
    image: "/images/docPrint.jpg",
  },
  {
    id: "visiting-cards",
    name: "Visiting Cards Printing",
    description: "Premium visiting cards with multiple designs and paper types.",
    paperSize: "3.5 x 2 inches",
    costPerCopy: 2,
    image: "/images/visitingCard.jpg",
  },
  {
    id: "book-printing",
    name: "Book Printing",
    description: "Professional book printing with binding and cover customization.",
    paperSize: "Custom sizes available",
    costPerCopy: 15,
    image: "/images/bookPrint.jpeg",
  },
  {
    id: "letterhead-printing",
    name: "Letter Head Printing",
    description: "Professional letterheads with custom logos and designs.",
    paperSize: "A4",
    costPerCopy: 8,
    image: "/images/online-letterhead.jpg",
  },
  {
    id: "certificate-printing",
    name: "Certificate Printing",
    description: "Custom-designed certificates with high-quality paper options.",
    paperSize: "A4, A3",
    costPerCopy: 10,
    image: "/images/Certificate.jpg",
  },
  {
    id: "poster-printing",
    name: "Poster Printing",
    description: "Large format posters with vibrant colors and durable materials.",
    paperSize: "A2, A1, A0",
    costPerCopy: 20,
    image: "/images/poster.jpg",
  },
  {
    id: "accessory-printing",
    name: "Accessory Printing",
    image: "/images/accessory-print.jpg",
    description: "Custom-printed T-shirts, coffee mugs, and personalized gifts.",
    tShirtSizes: ["S", "M", "L", "XL", "XXL"], // Only for T-shirts
    cost: 599, // Fixed price
  },
  {
    id: "3d-printing",
    name: "3D Printing",
    image: "/images/3d-print.webp",
    description: "Upload your 3D design and get it printed with precision.",
    dynamicPricing: true, // Enables variable pricing
  },
  {
    id: "3d-infra-design",
    name: "3D Infra Design",
    image: "/images/3d-infra.webp",
    description: "Request a professional 3D infrastructure design tailored to your needs.",
    dynamicPricing: true, // Enables variable pricing
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
