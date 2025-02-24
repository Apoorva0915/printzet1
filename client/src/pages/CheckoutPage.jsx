import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  console.log("Received Order Data:", order);

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/payment`,
      {
        amount: order.totalCost,
        customer,
      }
    );

    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: data.amount,
      currency: "INR",
      name: "Printing Service",
      description: "Order Payment",
      order_id: data.order_id,
      handler: function (response) {
        alert("Payment Successful!");
        navigate("/");
      },
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone,
      },
      theme: { color: "#2563eb" },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  if (!order) {
    console.log("No order data received!", location.state);
    return (
      <div className="h-screen flex items-center justify-center text-gray-700">
        <p>No order details available. Please go back and try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 bg-white shadow-2xl rounded-xl p-8">
        {/* Order Summary */}
        <div className="border p-6 rounded-lg shadow-md bg-blue-50">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Order Summary</h2>
          <p className="text-lg font-semibold text-gray-700">Total Cost: <span className="text-blue-600 font-bold">₹{order.totalCost}</span></p>
          <p className="text-gray-700">Copies: <span className="font-semibold">{order.numCopies}</span></p>
          <p className="text-gray-700">Print Type: <span className="font-semibold">{order.colorType}</span></p>
        </div>

        {/* Address Form */}
        <div className="border p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Shipping Details</h2>
          <div className="space-y-4">
            {["name", "email", "phone", "address", "city", "state", "pincode"].map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            onClick={handlePayment}
            className="mt-6 w-full px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
