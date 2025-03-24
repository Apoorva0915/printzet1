import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About-Us";
import Contact from "./pages/Contact-us";
// import FeaturedProducts from "./pages/FeaturedProducts";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CategoryDetails from "./pages/CategoryDetails";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import OrderPage from "./pages/OrderPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminDashboard from "./pages/AdminDashboard";
import FAQs from "./pages/FAQ";
import BlogPage from "./pages/BlogPage";
import Policies from "./pages/Policies";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/category/:categoryId" element={<CategoryDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/order-page/:categoryId" element={<OrderPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/policies" element={<Policies/>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
