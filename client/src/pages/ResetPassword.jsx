import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async () => {
    const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    if (res.ok) {
      alert("Password reset successful! Please login.");
      navigate("/login");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        className="w-full p-2 border rounded mb-3"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button
        onClick={handleResetPassword}
        className="w-full bg-green-500 text-white p-2 rounded mt-3 hover:bg-green-600"
      >
        Reset Password
      </button>
    </div>
  );
};

export default ResetPassword;
