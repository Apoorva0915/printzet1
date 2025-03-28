import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const OrderPage = () => {
    const [files, setFiles] = useState([]);
    const [numCopies, setNumCopies] = useState(1);
    const [colorType, setColorType] = useState("blackWhite");
    const [totalPages, setTotalPages] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState({});
    const [paperType, setPaperType] = useState(""); // Paper type
    const [printQuality, setPrintQuality] = useState(""); // Print quality
    const [binding, setBinding] = useState(""); // Binding
    const [lamination, setLamination] = useState(""); // Lamination
    const [ printedSides, setPrintedSides] = useState(""); //  printedSides
    const [error, setError] = useState(null);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const subcategoryParam = searchParams.get("subcategory")?.toLowerCase() || "";

    useEffect(() => {
        if (!categoryId) return;
        const fetchCategory = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/categories/${categoryId}`
                );
                setCategory(res.data);
            } catch (error) {
                console.error("Error fetching category:", error);
                navigate("/");
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [categoryId, navigate]);

    const validSubcategories = category?.subcategories || [];

    const subcategory = validSubcategories.find(sub => sub.id.toLowerCase() === subcategoryParam) || null;

    const onDrop = async (acceptedFiles) => {
        if (!category || !subcategory) {
            const errorMessage = "Invalid category or subcategory selection!";
            console.error(errorMessage);
            setError(errorMessage);
            return;
        }
        setError(null);

        const formData = new FormData();
        acceptedFiles.forEach((file) => formData.append("files", file));
        formData.append("categoryId", category._id);
        formData.append("subCategory", subcategory.id);
        formData.append("numCopies", numCopies);
        formData.append("colorType", colorType);
        formData.append("paperType", paperType);
        formData.append("printQuality", printQuality);
        formData.append("binding", binding);
        formData.append("lamination", lamination);
        formData.append("printedSides",  printedSides);

        Object.keys(selectedOptions).forEach((key) => {
            formData.append(key, selectedOptions[key]);
        });

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    withCredentials: true,
                }
            );

            setFiles((prev) => [...prev, ...acceptedFiles]);
            setTotalPages(response.data.totalPages);
            setTotalCost(response.data.totalCost || 0);
        } catch (error) {
            const message = error.response?.data?.message || "An unexpected error occurred";
            console.error("Error uploading files:", message, error.response?.data || error);
            setError(message);
        }
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleOptionChange = (optionType, value) => {
        setSelectedOptions((prev) => ({ ...prev, [optionType]: value }));

        if (optionType === "paperType") {
            setPaperType(value);
        }
        if (optionType === "printQuality") {
            setPrintQuality(value);
        }
        if (optionType === "binding") {
            setBinding(value);
        }
        if (optionType === "lamination") {
            setLamination(value);
        }
        if (optionType === "printedSides") {
            setPrintedSides(value);
        }
    };

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (!category) return <div className="text-center py-4 text-red-500">Error loading category data.</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-lg rounded-lg p-8">
                {/* File Upload Section */}
                <div className="border-dashed border-2 border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p className="text-gray-600">Drag & drop files here, or click to select files</p>
                    {files.length > 0 && (
                        <ul className="mt-4 w-full">
                            {files.map((file, index) => (
                                <li key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg mt-2">
                                    <span className="text-gray-800">{file.name}</span>
                                    <button onClick={() => removeFile(index)} className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm hover:bg-red-600 transition">✖</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Order Details Section */}
                <div className="bg-white shadow-md p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                    {subcategory && (
                        <h3 className="text-lg mb-4 text-gray-700">
                            Sub-Category: <span className="font-semibold">{subcategory.name}</span>
                        </h3>
                    )}

                    <h2 className="text-xl font-bold mb-4 text-gray-800">Order Details</h2>

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    {/* Options Select */}
                    <div className="space-y-4">
                        <div className="mb-3">
                            <label className="block text-sm font-medium">Color Type</label>
                            <select className="w-full border p-2 rounded mt-1" onChange={(e) => handleOptionChange("colorType", e.target.value)} value={colorType}>
                                <option value="blackWhite">Black & White</option>
                                <option value="color">Color</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="block text-sm font-medium">Paper Type</label>
                            <select className="w-full border p-2 rounded mt-1" onChange={(e) => handleOptionChange("paperType", e.target.value)} value={paperType}>
                                <option value="Normal">Normal (75 GSM)</option>
                                <option value="Duo">Duo (100 GSM)</option>
                                <option value="Glossy">Glossy (120 GSM)</option>
                                <option value="Matte">Matte (150 GSM)</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="block text-sm font-medium">Print Quality</label>
                            <select className="w-full border p-2 rounded mt-1" onChange={(e) => handleOptionChange("printQuality", e.target.value)} value={printQuality}>
                                <option value="Standard">Standard</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium">printed Sides</label>
                            <select className="w-full border p-2 rounded mt-1" onChange={(e) => handleOptionChange("printedSides", e.target.value)} value={printedSides}>
                                <option value="SingleSide">Single Side</option>
                                <option value="BacktoBack">Back to Back</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="block text-sm font-medium">Binding</label>
                            <select className="w-full border p-2 rounded mt-1" onChange={(e) => handleOptionChange("binding", e.target.value)} value={binding}>
                                <option value="Spiral Binding">Spiral Binding</option>
                                <option value="Hard Binding">Hard Binding</option>
                                <option value="Soft Binding">Soft Binding</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="block text-sm font-medium">Lamination</label>
                            <select className="w-full border p-2 rounded mt-1" onChange={(e) => handleOptionChange("lamination", e.target.value)} value={lamination}>
                                <option value="Glossy">Glossy</option>
                                <option value="Matte">Matte</option>
                            </select>
                        </div>

                        {/* Number of Copies */}
                        <div className="mb-3">
                            <label className="block text-sm font-medium">Number of Copies</label>
                            <input
                                type="number"
                                min="1"
                                value={numCopies}
                                onChange={(e) => setNumCopies(parseInt(e.target.value, 10))}
                                className="w-full border p-2 rounded mt-1"
                            />
                        </div>
                    </div>

                    <p className="mt-4 text-sm font-medium">Total Pages: {totalPages}</p>
                    <p className="mt-2 text-lg font-bold text-blue-600">Total Cost: ₹{totalCost}</p>

                    <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition" onClick={() => navigate("/checkout")}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
