import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryDetails = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/categories/${categoryId}`)
      .then((response) => {
        setCategory(response.data);
        setSubcategories(response.data.subcategories || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Category not found");
        setLoading(false);
      });
  }, [categoryId]);

  const isLoggedIn = !!localStorage.getItem("token");

  const handleOrderNow = (subcategoryId = null) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      const orderPath = subcategoryId 
        ? `/order-page/${categoryId}?subcategory=${subcategoryId}` 
        : `/order-page/${categoryId}`;
      navigate(orderPath);
    }
  };

  if (loading) return <div className="text-center text-blue-500 text-xl mt-10 animate-pulse">Loading...</div>;
  if (error) return <div className="text-center text-red-500 text-xl mt-10 font-semibold">{error}</div>;

  if (!category) {
    return null;
  }

  const isSpecialCategory = ["accessory-printing", "3d-printing", "3d-infra-design"].includes(categoryId);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-12">
        {/* Image Section */}
        <div className="md:w-1/2">
          <img
            src={category.image}
            alt={category.name}
            className="w-full rounded-xl shadow-md transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">{category.name}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{category.description}</p>

          {isSpecialCategory ? (
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-100 via-green-100 to-indigo-100 rounded-lg border border-gray-300 text-gray-700 shadow-lg">
              <p className="text-lg font-semibold">📩 For inquiries and requirements:</p>
              <p>Email: <a href="mailto:info@zenlynxtechnologies.com" className="text-blue-600 hover:underline">info@zenlynxtechnologies.com</a></p>
              <p>WhatsApp: <a href="https://wa.me/7325966706" className="text-green-600 hover:underline">7325966706</a></p>
            </div>
          ) : (
            <div className="space-y-5">
              <p className="text-lg font-semibold text-gray-700">📄 Paper Size: <span className="text-blue-600">{category.paperSize}</span></p>

              {category.costPerCopy && Object.keys(category.costPerCopy).length > 0 ? (
                <div>
                  <p className="text-lg font-semibold text-gray-700">💰 Cost per Copy:</p>
                  {Object.entries(category.costPerCopy).map(([colorType, paperTypes]) => (
                    <div key={colorType} className="mb-4">
                      <h5 className="font-semibold text-gray-700">{colorType}</h5>
                      <ul className="ml-4 list-disc">
                        {Object.entries(paperTypes).map(([paperType, prices]) => (
                          <li key={paperType} className="text-green-600">
                            <strong>{paperType}</strong>:
                            <ul className="ml-4 list-disc">
                              {Object.entries(prices).map(([side, price]) => (
                                <li key={side} className="text-gray-600">
                                  {side}: ₹{price}
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-lg font-semibold text-gray-700">💰 Cost per Copy: <span className="text-green-600">₹{category.cost}</span></p>
              )}

              {category.paperTypes && (
                <div>
                  <p className="text-lg font-semibold text-gray-700">📜 Paper Types:</p>
                  <ul className="ml-4 list-disc">
                    {Object.entries(category.paperTypes).map(([key, value]) => (
                      <li key={key} className="text-gray-600">
                        <strong>{key}</strong>: {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Display Subcategories */}
      {subcategories.length > 0 && (
        <div className="mt-14">
          <h3 className="text-3xl font-extrabold text-gray-800 mb-8">Choose a Subcategory</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subcategories.map((sub) => (
              
              <div key={sub.id} className="bg-white shadow-lg rounded-lg p-5 transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <img src={sub.image} alt={sub.name} className="w-full h-40 object-contain rounded-md mb-4" />
                <h4 className="text-xl font-semibold text-gray-800">{sub.name}</h4>
                <p className="text-gray-600 text-sm">{sub.description}</p>
                <button
                  className="mt-6 px-6 py-3 rounded-lg text-white font-semibold transition bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 hover:shadow-xl"
                  onClick={() => handleOrderNow(sub.id)}
                >
                  🛒 Order Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Ordering Section */}
      <div className="mt-16 bg-gradient-to-r from-indigo-100 to-blue-200 p-8 rounded-lg border border-gray-300 text-gray-800 text-center">
        <h3 className="text-3xl font-semibold text-gray-800 mb-4">Bulk Ordering Options</h3>
        <p className="text-lg">We offer bulk ordering options for businesses & institutions.</p>
        <p className="mt-4 text-xl font-medium">Send your requirements and inquiries to:</p>
        <p className="font-medium mt-2">📧 <a href="mailto:info@zenlynxtechnologies.com" className="text-blue-600 hover:underline">info@zenlynxtechnologies.com</a></p>
        <p className="font-medium">📱 <a href="https://wa.me/7325966706" className="text-green-600 hover:underline">7325966706</a></p>
      </div>
    </div>
  );
};

export default CategoryDetails;
