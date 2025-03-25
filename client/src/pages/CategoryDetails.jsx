import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryDetails = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/categories/${categoryId}`)
      .then((response) => {
        setCategory(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Category not found");
        setLoading(false);
      });
  }, [categoryId]);

  const isLoggedIn = !!localStorage.getItem("token");
  const handleOrderNow = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(`/order-page/${categoryId}`);
    }
  };

  if (loading)
    return <div className="text-center text-blue-500 text-xl mt-10 animate-pulse">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 text-xl mt-10 font-semibold">{error}</div>;

  const isSpecialCategory = ["accessory-printing", "3d-printing", "3d-infra-design"].includes(categoryId);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-10">
        {/* Image Section */}
        <div className="md:w-1/2">
          <img
            src={category.image}
            alt={category.name}
            className="w-full rounded-lg shadow-md transform transition duration-500 hover:scale-105"
          />
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{category.name}</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">{category.description}</p>

          {isSpecialCategory ? (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300 text-gray-700">
              <p className="text-lg font-semibold">📩 For inquiries and requirements:</p>
              <p>Email: <a href="mailto:info@zenlynxtechnologies.com" className="text-blue-600">info@zenlynxtechnologies.com</a></p>
              <p>WhatsApp: <a href="https://wa.me/7325966706" className="text-green-600">7325966706</a></p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-lg font-semibold text-gray-700">📄 Paper Size: <span className="text-blue-600">{category.paperSize}</span></p>
              {category.costPerCopy && typeof category.costPerCopy === "object" ? (
                <div>
                  <p className="text-lg font-semibold text-gray-700">💰 Cost per Copy:</p>
                  <ul className="ml-4 list-disc">
                    {Object.entries(category.costPerCopy).map(([key, value]) => (
                      <li key={key} className="text-green-600">
                        {key.replace("-", " ").toUpperCase()}: ₹{value}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-lg font-semibold text-gray-700">💰 Cost per Copy: <span className="text-green-600">₹{category.costPerCopy}</span></p>
              )}

              {/* Order Now Button */}
              <button
                className="mt-6 px-6 py-3 rounded-lg text-white font-bold transition bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105 hover:shadow-xl"
                onClick={handleOrderNow}
              >
                🛒 Order Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Ordering Section */}
      <div className="mt-10 bg-gray-50 p-6 rounded-lg border border-gray-200 text-gray-700 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Bulk Ordering Options</h3>
        <p className="text-lg">We offer bulk ordering options for businesses & institutions.</p>
        <p className="mt-2">Send your requirements and inquiries to:</p>
        <p className="font-medium mt-1">📧 <a href="mailto:info@zenlynxtechnologies.com" className="text-blue-600">info@zenlynxtechnologies.com</a></p>
        <p className="font-medium">📱 <a href="https://wa.me/7325966706" className="text-green-600">7325966706</a></p>
      </div>
    </div>
  );
};

export default CategoryDetails;