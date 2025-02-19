import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, loading } = useAuth(); 
  const [emailOrMobile, setemailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);
    try {
      await login({ emailOrMobile, password });
      navigate("/"); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <input
        type="text"
        placeholder="Email or Mobile Number"
        className="w-full p-2 border rounded mb-3"
        value={emailOrMobile}
        onChange={(e) => setemailOrMobile(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Link to="/forgot-password" className="text-blue-500 text-sm">
        Forgot Password?
      </Link>

      <button
        className="w-full bg-blue-500 text-white p-2 rounded mt-3 hover:bg-blue-600 flex justify-center"
        onClick={handleLogin}
        disabled={loading} 
      >
        {loading ? (
          <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
        ) : (
          "Login"
        )}
      </button>

      <p className="text-sm mt-3 text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="text-green-500">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
