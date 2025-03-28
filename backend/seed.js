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
        image: "https://res.cloudinary.com/di3caz3zz/image/upload/v1740146868/printEcom/docPrintjpg_i2y7cx.jpg",

        subcategories: [
            {
                id: "document-printing",
                name: "Document Printing",
                description: "Professional documents printing for business and personal use.",
                image:"https://res.cloudinary.com/di3caz3zz/image/upload/v1743165532/FA_DOCUMENT_PRINTING75_to3w4v.jpg"
            },
            {
                id: "letterhead-printing",
                name: "Letterhead Printing",
                description: "Professional letterhead printing for business and personal use.",
                image:"https://res.cloudinary.com/di3caz3zz/image/upload/v1740146868/printEcom/online-letterhead_bghab0.jpg"
            },
            {
                id: "certificates-printing",
                name: "Certificates Printing",
                description: "High-quality certificate printing for academic and corporate needs.",
                image:"https://res.cloudinary.com/di3caz3zz/image/upload/v1740146868/printEcom/Certificate_w6mmgv.jpg"
            },
            {
                id: "poster-printing",
                name: "Poster Printing",
                description: "Vibrant and detailed poster printing for marketing and personal use.",
                image:"https://res.cloudinary.com/di3caz3zz/image/upload/v1740146868/printEcom/poster_fkshnm.jpg"
            },
            {
                id: "leaflet-flyers-pamphlet-printing",
                name: "Leaflet/Flyers/Pamphlet Printing",
                description: "Compact and engaging prints for business promotions and events.",
                image:"https://res.cloudinary.com/di3caz3zz/image/upload/v1743165629/Travel-Trifold-Brochure_pfmxjk.jpg"
            },
            {
                id: "notebook-printing",
                name: "Notebook Printing",
                description: "Custom notebooks for students, offices, and personal journaling.",
                image:"https://res.cloudinary.com/di3caz3zz/image/upload/v1743165738/Customize-Notebook-Printing-b_e1rcjk.jpg"
            },
            {
                id: "brochure-printing",
                name: "Brochure Printing",
                description: "Informative and professional brochures for marketing and corporate needs.",
                image:"https://res.cloudinary.com/di3caz3zz/image/upload/v1743165814/brochure-copy_mpgzol.jpg"
            },
            {
                id: "photo-album-printing",
                name: "Photo Album Printing",
                description: "Premium-quality printed albums for cherished memories.",
                image:"https://res.cloudinary.com/di3caz3zz/image/upload/v1743165867/family-photo-album-spring-weekend_vhiais.webp"
            },
        ],

        colorType: {
            "Black & White": "Standard monochrome printing",
            "Color": "Vivid full-color printing",
        },
        costPerCopy: {  //  Use subcategory IDs as keys
            "document-printing": {
                "75GSM - Normal Paper": { singleSide: 0.99, backToBack: 0.89 },
                "100GSM - Duo Paper": { singleSide: 2.5, backToBack: 2 },
            },
            "letterhead-printing": {
                "75GSM - Normal Paper": { singleSide: 0.99, backToBack: 0.89 },
                "100GSM - Duo Paper": { singleSide: 2.5, backToBack: 2 },
            },
            "certificates-printing": {
                "75GSM - Normal Paper": { singleSide: 5.75, backToBack: 5.25 },
                "100GSM - Duo Paper": { singleSide: 7, backToBack: 7 },
            },
            "poster-printing": {
                "75GSM - Normal Paper": { singleSide: 5.75, backToBack: 5.25 },
                "100GSM - Duo Paper": { singleSide: 7, backToBack: 7 },
            },
            "leaflet-flyers-pamphlet-printing": {
                "75GSM - Normal Paper": { singleSide: 5.75, backToBack: 5.25 },
                "100GSM - Duo Paper": { singleSide: 7, backToBack: 7 },
            },
            "notebook-printing": {
                "75GSM - Normal Paper": { singleSide: 5.75, backToBack: 5.25 },
                "100GSM - Duo Paper": { singleSide: 7, backToBack: 7 },
            },
             "brochure-printing": {
                "75GSM - Normal Paper": { singleSide: 5.75, backToBack: 5.25 },
                "100GSM - Duo Paper": { singleSide: 7, backToBack: 7 },
            },
             "photo-album-printing": {
                "75GSM - Normal Paper": { singleSide: 5.75, backToBack: 5.25 },
                "100GSM - Duo Paper": { singleSide: 7, backToBack: 7 },
            },
        },

        paperTypes: {
            "Normal": "75 GSM",
            "Duo": "100 GSM",
            "Glossy": "120 GSM",
            "Matte": "150 GSM",
        },

        printQualities: {
            "Standard": "Regular print quality",
            "High": "High-resolution print with rich colors",
        },

        printedSides: {
            "Single Side": "Printed on one side only",
            "Back to Back": "Printed on both sides",
        },

        bindingOptions: {
            "Spiral Binding": "Plastic or metal spiral binding",
            "Hard Binding": "Durable hardbound cover",
            "Soft Binding": "Flexible cover binding",
        },

        laminationOptions: {
            "Glossy": "Shiny, reflective lamination",
            "Matte": "Soft, non-reflective finish",
        },

        pageOrientations: {
            "Portrait": "Standard vertical format",
            "Landscape": "Wider horizontal format",
        },

        coverPages: {
            "None": "No additional cover page",
            "Transparent": "Clear plastic cover",
            "Cardstock": "Harder paper cover for durability",
        },
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