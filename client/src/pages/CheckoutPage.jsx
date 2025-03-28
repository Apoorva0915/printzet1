// Updated CheckoutPage.jsx to display additional printing options
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import query from "india-pincode-search";

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

  const handlePayment = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/payment`,
        {
          amount: order.totalCost,
          customer,
        }
      );
      alert("Payment Successful!");
      navigate("/");
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  if (!order) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-700">
        <p>No order details available. Please go back and try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 bg-white shadow-2xl rounded-xl p-8">
        <div className="border p-6 rounded-lg shadow-md bg-blue-50">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Order Summary</h2>
          <p className="text-lg font-semibold text-gray-700">
            Total Cost: <span className="text-blue-600 font-bold">₹{order.totalCost}</span>
          </p>
          <p className="text-gray-700">Copies: <span className="font-semibold">{order.numCopies}</span></p>
          <p className="text-gray-700">Print Type: <span className="font-semibold">{order.colorType}</span></p>
          <p className="text-gray-700">Paper Type: <span className="font-semibold">{order.paperType || "N/A"}</span></p>
          <p className="text-gray-700">Print Quality: <span className="font-semibold">{order.printQuality || "N/A"}</span></p>
          <p className="text-gray-700">Binding: <span className="font-semibold">{order.binding || "N/A"}</span></p>
          <p className="text-gray-700">Lamination: <span className="font-semibold">{order.lamination || "N/A"}</span></p>
        </div>
        <div className="border p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Shipping Details</h2>
          <input type="text" name="name" placeholder="Name" onChange={(e) => setCustomer({ ...customer, name: e.target.value })} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <PhoneInput country="in" value={customer.phone} onChange={(value) => setCustomer({ ...customer, phone: value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="text" name="pincode" placeholder="Pincode" onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <button onClick={handlePayment} className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Pay Now</button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
