import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem("token");

                const [usersRes, ordersRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/users`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/orders`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setUsers(usersRes.data);
                setOrders(ordersRes.data);
            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 bg-white shadow rounded-lg">
                            <h3 className="text-lg font-semibold">Total Users</h3>
                            <p className="text-3xl font-bold">{users.length}</p>
                        </div>

                        <div className="p-4 bg-white shadow rounded-lg">
                            <h3 className="text-lg font-semibold">Total Orders</h3>
                            <p className="text-3xl font-bold">{orders.length}</p>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mt-6">Recent Orders</h3>
                    <table className="w-full mt-4 border-collapse border border-gray-200">
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="border p-2">{order.userId ? order.userId.fullName : "Unknown User"}</td>
                                    <td className="border p-2">
                                        {order.userId && order.userId.address ? (
                                            <>
                                                <p>{order.userId.address.address}</p>
                                                <p>{order.userId.address.city}, {order.userId.address.state} - {order.userId.address.pincode}</p>
                                            </>
                                        ) : (
                                            <p className="text-gray-500">No address available</p>
                                        )}
                                    </td>
                                    <td className="border p-2">{order.categoryId ? order.categoryId.name : "No Category"}</td>
                                    <td className="border p-2">{order.subCategory || "N/A"}</td>
                                    <td className="border p-2">{order.numCopies || 1}</td>
                                    <td className="border p-2">{order.colorType === "color" ? "Color" : "Black & White"}</td>
                                    <td className="border p-2">{order.totalPages || "N/A"}</td>
                                    <td className="border p-2">₹{order.totalCost || 0}</td>
                                    <td className="border p-2">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</td>
                                    <td className="border p-2">{order.status || "Pending"}</td>
                                    <td className="border p-2">
                                        {order.filePaths && order.filePaths.length > 0 ? (
                                            order.filePaths.map((file, index) => (
                                                <div key={index} className="mb-1">
                                                    <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                                        View File {index + 1}
                                                    </a>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No files uploaded</p>
                                        )}
                                    </td>
                                    <td className="border p-2">
                                        <button
                                            className="bg-green-500 text-white px-3 py-1 rounded"
                                            onClick={async () => {
                                                await axios.put(
                                                    `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/orders/${order._id}`,
                                                    { status: "completed" },
                                                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                                                );
                                                window.location.reload();
                                            }}
                                        >
                                            Mark Completed
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </>
            )}
        </div>
    );
};

export default AdminDashboard;
