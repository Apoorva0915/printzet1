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

  // Check if user is logged in (JWT stored in localStorage)
  const isLoggedIn = !!localStorage.getItem("token");

  const handleOrderNow = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(`/order-page/${categoryId}`);
    }
  };

  if (loading) return <div className="text-center text-blue-500 text-xl mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 text-xl mt-10">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center gap-10">
      <div className="md:w-1/2">
        <img
          src={category.image}
          alt={category.name}
          className="w-full rounded-lg shadow-lg"
        />
      </div>

      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold mb-4">{category.name}</h2>
        <p className="text-gray-600 mb-4">{category.description}</p>
        <p className="text-lg font-semibold">
          Paper Size: <span className="text-blue-600">{category.paperSize}</span>
        </p>
        <p className="text-lg font-semibold">
          Cost per Copy: <span className="text-green-600">₹{category.costPerCopy}</span>
        </p>

        {/* Order Now Button */}
        <button
          className="mt-6 px-6 py-3 rounded-lg text-white font-bold transition bg-blue-600 hover:bg-blue-700"
          onClick={handleOrderNow}
        >
          Order Now
        </button>
      </div>
    </div>
  );
};

export default CategoryDetails;
