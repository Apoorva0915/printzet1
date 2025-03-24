const categories = [
  {
    id: "document-printing",
    name: "Document Printing",
    image: "/images/docPrintjpg.jpg",
    description: "High-quality document printing with various paper sizes and formats.",
    paperSize: "A4, A3",
    costPerCopy: 5,
  },
  {
    id: "visiting-cards",
    name: "Visiting Cards Printing",
    image: "/images/visitingCard.jpg",
    description: "Premium visiting cards with multiple designs and paper types.",
    paperSize: "3.5 x 2 inches",
    costPerCopy: 2,
  },
  {
    id: "book-printing",
    name: "Book Printing",
    image: "/images/bookPrint.jpeg",
    description: "Professional book printing with binding and cover customization.",
    paperSize: "Custom sizes available",
    costPerCopy: 15,
  },
  {
    id: "letterhead-printing",
    name: "Letter Head Printing",
    image: "/images/online-letterhead.jpg",
    description: "Professional letterheads with custom logos and designs.",
    paperSize: "A4",
    costPerCopy: 8,
  },
  {
    id: "certificate-printing",
    name: "Certificate Printing",
    image: "/images/Certificate.jpg",
    description: "Custom-designed certificates with high-quality paper options.",
    paperSize: "A4, A3",
    costPerCopy: 10,
  },
  {
    id: "poster-printing",
    name: "Poster Printing",
    image: "/images/poster.jpg",
    description: "Large format posters with vibrant colors and durable materials.",
    paperSize: "A2, A1, A0",
    costPerCopy: 20,
  },
  {
    id: "accessory-printing",
    name: "Accessory Printing",
    image: "/images/accesory-print.jpg",
    description: "Custom-printed T-shirts, coffee mugs, and personalized gifts.",
    tShirtSizes: ["S", "M", "L", "XL", "XXL"], // Sizes only for T-shirts
    cost: 599, // Fixed price for all accessories
  },
  {
    id: "3d-printing",
    name: "3D Printing",
    image: "/images/3d-print.webp",
    description: "Upload your 3D design and get it printed with precision.",
    costPerCopy: "Based on complexity",
  },
  {
    id: "3d-infra-design",
    name: "3D Infra Design",
    image: "/images/3d-infra.webp",
    description: "Request a professional 3D infrastructure design tailored to your needs.",
    costPerCopy: "Based on project scope",
  },
];

export default categories;
