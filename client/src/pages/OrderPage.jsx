// OrderPage.jsx (Maintain Layout & Show Uploaded Files)
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const OrderPage = () => {
  const [files, setFiles] = useState([]);
  const [numCopies, setNumCopies] = useState(1);
  const [colorType, setColorType] = useState("blackWhite");
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState({});
  const [subCategory, setSubCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (!category || !category._id) return;
      const formData = new FormData();
      acceptedFiles.forEach((file) => formData.append("files", file));
      formData.append("categoryId", category._id);
      formData.append("numCopies", numCopies);
      formData.append("colorType", colorType);
      formData.append("subCategory", subCategory);
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
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    },
  });

  useEffect(() => {
    if (!categoryId) return;
    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/categories/${categoryId}`)
      .then((res) => {
        setCategory(res.data);
        setLoading(false);
      })
      .catch(() => navigate("/"));
  }, [categoryId, navigate]);

  const placeOrder = () => {
    if (!category || !category._id || files.length === 0) return;
    navigate("/checkout", {
      state: {
        order: {
          totalCost: calculateTotalCost(),
          numCopies,
          colorType,
          subCategory,
        },
      },
    });
  };

  const calculateTotalCost = () => {
    if (!category?.costPerCopy || !subCategory) return 0;
    const subCategoryCost = category.costPerCopy[subCategory] || 0;
    return totalPages * numCopies * subCategoryCost * (colorType === "color" ? 2 : 1);
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-lg rounded-lg p-8">
        <div className="border-dashed border-2 border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition" {...getRootProps()}>
          <input {...getInputProps()} />
          <p className="text-gray-600">Drag & drop files here, or click to select files</p>
          {files.length > 0 && (
            <ul className="mt-4 text-sm text-gray-500">
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Order Details</h2>
          <p className="text-gray-700 font-medium">Category: {category?.name}</p>
          {category?.id === "document-printing" && (
            <div className="mt-4">
              <label className="block text-sm font-medium">Select Document Type</label>
              <select className="w-full border p-2 rounded mt-1" value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                {Object.keys(category.costPerCopy).map((key) => (
                  <option key={key} value={key}>{key.replace("-", " ").toUpperCase()}</option>
                ))}
              </select>
            </div>
          )}
          <p className="mt-4 text-sm font-medium">Total Pages: {totalPages}</p>
          <p className="mt-2 text-lg font-bold text-blue-600">Total Cost: ₹{calculateTotalCost()}</p>
          <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition" onClick={placeOrder}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;