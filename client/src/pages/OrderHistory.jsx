import { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          console.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handlePayment = async (order) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/payment`,
        {
          amount: order.totalCost,
          orderId: order._id,
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Printing Service",
        description: "Order Payment",
        order_id: data.order_id,
        handler: async function () {
          alert("Payment Successful!");

          // Update order status
          await axios.put(
            `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders/${order._id}`,
            { status: "completed" }
          );

          setOrders((prevOrders) =>
            prevOrders.map((o) => (o._id === order._id ? { ...o, status: "completed" } : o))
          );
        },
        prefill: {
          name: "User",
          email: "user@example.com",
        },
        theme: { color: "#2563eb" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-50 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Order History</h2>
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 p-5 rounded-lg shadow-md bg-white"
            >
              <p className="text-lg font-semibold text-gray-800">
                <span className="text-gray-600">Order ID:</span> {order._id}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Category:</span> {order.categoryId?.name || "Unknown"}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Copies:</span> {order.numCopies}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Total Cost:</span> ₹{order.totalCost}
              </p>
              <p
                className={`mt-2 text-sm font-semibold px-3 py-1 rounded-full inline-block ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </p>
              <p className="text-gray-600 text-sm">
                Ordered On: {new Date(order.createdAt).toLocaleDateString()}
              </p>

              {/* File Links */}
              <div className="mt-3">
                <strong className="text-gray-700">Files:</strong>
                <ul className="list-disc ml-5 text-blue-600">
                  {order.filePaths.map((file, index) => (
                    <li key={index}>
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        View File {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pay Now Button */}
              {order.status === "pending" && (
                <button
                  onClick={() => handlePayment(order)}
                  className="mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
                >
                  Pay Now
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No orders found.</p>
      )}
    </div>
  );
};

export default OrderHistory;
