import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { Link as ScrollLink } from "react-scroll";
import logo from "../assets/logo.png";

const Navbar = () => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-gray-800">
                   <img src={logo} alt="logo" className="w-auto h-10" />
                </Link>
                {/* Desktop Nav Links */}
                <div className="hidden md:flex space-x-6">
                    <Link to="/" className="text-gray-700 font-semibold hover:text-blue-600 transition">Home</Link>
                    <ScrollLink to="about" smooth={true} duration={500} className="text-gray-700 font-semibold hover:text-gray-900 cursor-pointer">
                        About
                    </ScrollLink>
                    <ScrollLink to="categories" smooth={true} duration={500} className="text-gray-700 font-semibold hover:text-gray-900 cursor-pointer">
                        Services
                    </ScrollLink>
                </div>

                {/* Right Side: User / Login-Signup */}
                <div className="hidden md:block relative">
                    {user ? (
                        // User Dropdown
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                            >
                                <span className="font-medium">{user.fullName}</span>
                                <FiChevronDown />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Order History</Link>
                                    <button
                                        onClick={() => {
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
                        // Login & Signup Buttons
                        <div className="space-x-4">
                            <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                                Login
                            </Link>
                            <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    className="md:hidden text-gray-800 text-2xl"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Mobile Nav Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white shadow-md absolute top-16 left-0 w-full py-4">
                    <div className="flex flex-col space-y-4 px-6">
                        <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
                        <ScrollLink to="about" smooth={true} duration={500} className="text-gray-700 hover:text-gray-900 cursor-pointer">
                        About US
                    </ScrollLink>
                    <ScrollLink to="categories" smooth={true} duration={500} className="text-gray-700 hover:text-gray-900 cursor-pointer">
                        Categories
                    </ScrollLink>
                    </div>

                    {/* Mobile User Section */}
                    <div className="border-t mt-4 pt-4 px-6">
                        {user ? (
                            <div>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-full text-left flex items-center justify-between px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    <span className="font-medium">{user.fullName}</span>
                                    <FiChevronDown />
                                </button>

                                {dropdownOpen && (
                                    <div className="mt-2 bg-white shadow-lg rounded-lg py-2">
                                        <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                                        <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Order History</Link>
                                        <button
                                            onClick={logout}
                                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-2">
                                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition text-center">
                                    Login
                                </Link>
                                <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition text-center">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;