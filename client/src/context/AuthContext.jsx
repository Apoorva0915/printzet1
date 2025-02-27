import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if the user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(storedUser);
    }
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      const userData = { ...data.user, isAdmin: data.user.isAdmin || false };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);
      setUser(userData);

      // ✅ Redirect without `useNavigate`
      window.location.href = userData.isAdmin ? "/admin/dashboard" : "/";

      return data;
    } catch (error) {
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      const newUser = { ...data.user, isAdmin: data.user.isAdmin || false };

      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", data.token);
      setUser(newUser);

      // ✅ Redirect without `useNavigate`
      window.location.href = newUser.isAdmin ? "/admin/dashboard" : "/";

      return data;
    } catch (error) {
      alert(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("Logout function called!");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login"; // ✅ Redirect without `useNavigate`
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
