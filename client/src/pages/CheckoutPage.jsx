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

  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setCustomer({ ...customer, phone: value });
  };

  const handlePincodeChange = (e) => {
    const pincode = e.target.value;
    setCustomer({ ...customer, pincode });

    if (pincode.length === 6) {
      const details = query.search(pincode);

      if (details && details.length > 0) {
        setCustomer({
          ...customer,
          pincode,
          city: details[0].district || details[0].city,
          state: details[0].state, // Fetching state dynamically
        });
      } else {
        alert("Invalid pincode. Please enter a valid Indian pincode.");
      }
    }
  };

  const handlePayment = async () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load. Please check your internet connection and try again.");
      return;
    }

    try {
      // First, update the user's address in the database
      await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/update-address`, {
        email: customer.email,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
      });

      // Then, proceed with payment
      const { data } = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/payment`,
        {
          amount: order.totalCost,
          customer,
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
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
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
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
          <p className="text-lg font-semibold text-gray-700">
            Total Cost: <span className="text-blue-600 font-bold">₹{order.totalCost}</span>
          </p>
          <p className="text-gray-700">
            Copies: <span className="font-semibold">{order.numCopies}</span>
          </p>
          <p className="text-gray-700">
            Print Type: <span className="font-semibold">{order.colorType}</span>
          </p>
        </div>

        {/* Address Form */}
        <div className="border p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Shipping Details</h2>
          <div className="space-y-4">
            {["name", "email", "address"].map((field) => (
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

            {/* Phone Input with Country Code */}
            <PhoneInput
              country={"in"}
              onlyCountries={["in"]}
              value={customer.phone}
              onChange={handlePhoneChange}
              inputProps={{
                name: "phone",
                required: true,
                autoFocus: true,
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Pincode Input */}
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={customer.pincode}
              onChange={handlePincodeChange}
              maxLength="6"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* City (Auto-filled) */}
            <input
              type="text"
              name="city"
              placeholder="City"
              value={customer.city}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />

            {/* State (Auto-filled) */}
            <input
              type="text"
              name="state"
              placeholder="State"
              value={customer.state}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
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
