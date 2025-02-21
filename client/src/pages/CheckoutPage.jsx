import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

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
    const { data } = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/payment`, {
      amount: order.totalCost,
      customer,
    });

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
      theme: { color: "#3399cc" },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  if (!order) {
    console.log("No order data received!");
    return <div>Loading order details...</div>;
  }
  

  return (
    <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Order Summary */}
      <div className="border p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <p>Total Cost: ₹{order.totalCost}</p>
        <p>Copies: {order.numCopies}</p>
        <p>Print Type: {order.colorType}</p>
      </div>

      {/* Address Form */}
      <div className="border p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Shipping Details</h2>
        <input type="text" name="name" placeholder="Full Name" onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
        <input type="text" name="phone" placeholder="Phone Number" onChange={handleInputChange} required />
        <input type="text" name="address" placeholder="Address" onChange={handleInputChange} required />
        <input type="text" name="city" placeholder="City" onChange={handleInputChange} required />
        <input type="text" name="state" placeholder="State" onChange={handleInputChange} required />
        <input type="text" name="pincode" placeholder="Pincode" onChange={handleInputChange} required />

        <button onClick={handlePayment} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg">
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
