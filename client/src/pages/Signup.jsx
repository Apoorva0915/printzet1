import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await signup(userData);
      navigate("/");
    } catch (error) {
      alert("Signup failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <input type="text" name="fullName" placeholder="Full Name" value={userData.fullName} onChange={handleChange} className="w-full p-2 border rounded mt-2" required />
          <input type="text" name="mobile" placeholder="Mobile Number" value={userData.mobile} onChange={handleChange} className="w-full p-2 border rounded mt-2" required />
          <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} className="w-full p-2 border rounded mt-2" required />
          <input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleChange} className="w-full p-2 border rounded mt-2" required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={userData.confirmPassword} onChange={handleChange} className="w-full p-2 border rounded mt-2" required />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mt-4" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account? <a href="/login" className="text-blue-600">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
