import { useEffect, useState } from "react";

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

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Order History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id} className="border p-3 mb-3 rounded">
            <p><strong>Category:</strong> {order.category}</p>
            <p><strong>Copies:</strong> {order.copies}</p>
            <p><strong>Price:</strong> ₹{order.totalPrice}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrderHistory;
