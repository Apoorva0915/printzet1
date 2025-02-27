import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem("token");
          navigate("/login"); // Redirect if not logged in
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gray-50  p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Profile</h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-500 text-white flex items-center justify-center text-xl font-bold rounded-full">
                {user.fullName.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-700">{user.fullName}</p>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700"><strong>Full Name:</strong> {user.fullName}</p>
              <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
              <p className="text-gray-700"><strong>Mobile:</strong> {user.mobile || "N/A"}</p>
            </div>

            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              View Order History
            </button>
          </div>
        ) : (
          <p className="text-center text-red-500">User not found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
