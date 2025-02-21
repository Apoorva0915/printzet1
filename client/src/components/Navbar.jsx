import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    try {
        const { user, logout } = useAuth();
        const [dropdownOpen, setDropdownOpen] = useState(false);

        return (
            <nav className="bg-white shadow-md p-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-gray-800">PrintEcom</Link>

                {/* Navigation Links */}
                <div className="space-x-6">
                    <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
                    <Link to="/" className="text-gray-700 hover:text-gray-900">Services</Link>
                    <Link to="/" className="text-gray-700 hover:text-gray-900">Categories</Link>
                </div>

                {/* Right Side: Show User or Login/Signup */}
                <div className="relative">
                    {user ? (
                        // User Dropdown
                        <div>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md hover:bg-gray-200"
                            >
                                <span className="font-medium">{user.fullName}</span>
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Order History</Link>
                                    <button
                                        onClick={() => {
                                            console.log("Sign Out Clicked!");
                                            logout();
                                            setDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                                        >
                                        Sign Out
                                    </button>
                               </div>
                            )}
                        </div>
                    ) : (
                        // Login / Signup
                        <div className="space-x-4">
                            <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                Login
                            </Link>
                            <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        );
    } catch (error) {
        console.error("Navbar Error:", error);
        return null;
    }
};

export default Navbar;
