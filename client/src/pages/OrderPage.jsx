import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OrderPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [numCopies, setNumCopies] = useState(1);
  const [colorType, setColorType] = useState("blackWhite");
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/categories/${categoryId}`)
      .then((res) => {
        setCategory(res.data);
        setLoading(false);
      })
      .catch(() => navigate("/"));
  }, [categoryId, navigate]);

  // Handle file selection
  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    if (files.length + uploadedFiles.length > 10) {
      alert("You can upload up to 10 files only.");
      return;
    }
    setFiles([...files, ...uploadedFiles]);
    generatePreviews([...files, ...uploadedFiles]);
  };

  // Handle drag & drop
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (files.length + droppedFiles.length > 10) {
      alert("You can upload up to 10 files only.");
      return;
    }
    setFiles([...files, ...droppedFiles]);
    generatePreviews([...files, ...droppedFiles]);
  };

  // Prevent default behavior on drag over
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Open file input on clicking the drop area
  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  // Remove a file
  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    generatePreviews(updatedFiles);
  };

  // Generate previews
  const generatePreviews = (fileList) => {
    const newPreviews = fileList.map((file) => {
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file);
      }
      return null;
    });
    setPreviews(newPreviews);
  };

  // Handle order submission
  const handleOrderSubmit = async () => {
    if (files.length === 0) {
      alert("Please upload at least one file.");
      return;
    }
  
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);  // Matches the backend field name
    });
    
    formData.append("numCopies", numCopies);
    formData.append("colorType", colorType);
    formData.append("categoryId", category._id); // Ensure it's using MongoDB _id
    console.log("Category ID before sending:", category._id);

    // Get token from local storage
    const token = localStorage.getItem("token");
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });
  
      navigate("/checkout", { state: { order: response.data } });
    } catch (error) {
      console.error("Order Error:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };
  
  
  
  

  if (loading) return <div>Loading...</div>;

  const baseCost = category.costPerCopy;
  const costMultiplier = colorType === "color" ? 2 : 1;
  const totalCost = files.length * numCopies * baseCost * costMultiplier;

  return (
    <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center gap-10">
      {/* File Upload Section */}
      <div
        className="border-2 border-dashed border-gray-400 w-1/2 h-64 flex flex-col items-center justify-center cursor-pointer relative overflow-auto p-2"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClickUpload}
      >
        {files.length > 0 ? (
          <div className="w-full h-full overflow-auto grid grid-cols-2 gap-2">
            {files.map((file, index) => (
              <div key={index} className="relative flex items-center">
                {previews[index] ? (
                  <img src={previews[index]} alt="Preview" className="max-h-20 max-w-20 rounded-md" />
                ) : (
                  <p className="text-gray-500 truncate w-32">{file.name}</p>
                )}
                {/* Remove File Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Drag & Drop up to 10 files or click to upload</p>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      </div>

      {/* Order Settings Section */}
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-4">{category.name} Order</h2>

        {/* Number of Copies */}
        <div className="flex items-center gap-4">
          <button onClick={() => setNumCopies((prev) => Math.max(prev - 1, 1))}>-</button>
          <span className="text-xl">{numCopies}</span>
          <button onClick={() => setNumCopies((prev) => prev + 1)}>+</button>
        </div>

        {/* Color Selection */}
        <div className="mt-4">
          <label className="mr-2">Print Type:</label>
          <select onChange={(e) => setColorType(e.target.value)} value={colorType}>
            <option value="blackWhite">Black & White</option>
            <option value="color">Color</option>
          </select>
        </div>

        {/* Cost Display */}
        <p className="text-lg font-bold mt-4">Total Cost: ₹{totalCost}</p>

        {/* Place Order Button */}
        <button
          onClick={handleOrderSubmit}
          className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
