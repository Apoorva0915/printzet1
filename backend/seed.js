import mongoose from "mongoose";
import Category from "./models/Category.js";
import dotenv from "dotenv";

dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Error:", err));;

const categories = [
  {
    id: "document-printing",
    name: "Document Printing",
    description: "High-quality document printing with various paper sizes and formats.",
    paperSize: "A4, A3",
    costPerCopy: 5,
  },
  {
    id: "visiting-cards",
    name: "Visiting Cards Printing",
    description: "Premium visiting cards with multiple designs and paper types.",
    paperSize: "3.5 x 2 inches",
    costPerCopy: 2,
  },
  {
    id: "book-printing",
    name: "Book Printing",
    description: "Professional book printing with binding and cover customization.",
    paperSize: "Custom sizes available",
    costPerCopy: 15,
  },
  {
    id: "letterhead-printing",
    name: "Letter Head Printing",
    description: "Professional letterheads with custom logos and designs.",
    paperSize: "A4",
    costPerCopy: 8,
  },
  {
    id: "certificate-printing",
    name: "Certificate Printing",
    description: "Custom-designed certificates with high-quality paper options.",
    paperSize: "A4, A3",
    costPerCopy: 10,
  },
  {
    id: "poster-printing",
    name: "Poster Printing",
    description: "Large format posters with vibrant colors and durable materials.",
    paperSize: "A2, A1, A0",
    costPerCopy: 20,
  },
];

const seedDB = async () => {
  await Category.deleteMany({});
  await Category.insertMany(categories);
  console.log("Database Seeded!");
  mongoose.connection.close();
};

seedDB();
