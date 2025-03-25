import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import categories from "../data/categories";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import slider1Img from "../assets/home-slider/slider1Img.jpg";
import slider2Img from "../assets/home-slider/slider2Img.jpg";
import slider3Img from "../assets/home-slider/slider3Img.jpg";
import slider4Img from "../assets/home-slider/slider4Img.jpg";
import slider5Img from "../assets/home-slider/slider5Img.jpg";

import aboutUsImg from "../assets/about-us.jpg";
import { useEffect, useState } from "react";

const customers = [
  "/images/Customer1.png",
  "/images/Customer2.png",
  "/images/Customer3.png",
  "/images/Customer4.png",
];

const featuredProducts = [
  { id: 1, name: "Flex Banners", image: "/images/flex-banner.jpg" },
  { id: 2, name: "Mugs", image: "/images/mugs.jpg" },
  { id: 3, name: "Business Cards", image: "/images/business-cards.jpg" },
];

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, []);

  const handleHeroButtonClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-[500px] md:h-[550px] lg:h-[600px]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          className="w-full h-full"
        >
          {[slider1Img, slider2Img, slider3Img, slider4Img, slider5Img].map((img, index) => (
            <SwiperSlide key={index} className="relative">
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6">
                <h1 className="text-4xl md:text-5xl font-extrabold">
                  Print Anything, Anytime
                </h1>
                <p className="text-lg md:text-xl mt-2 max-w-2xl">
                  High-quality printing solutions for documents, accessories, and 3D prints.
                </p>
                <button
                  onClick={handleHeroButtonClick}
                  className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg shadow-md transition"
                >
                  Place Order
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-8" id="about">
        <div className="md:w-1/2">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">About PrintZet</h2>
          <p className="text-gray-600 leading-relaxed">
            PrintZet is your one-stop destination for all printing needs. We offer high-quality printing solutions,
            from documents to posters, business cards, and more. Experience fast, reliable, and cost-effective printing services with us!
          </p>
          <Link to="/about" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Learn More
          </Link>
        </div>
        <img src={aboutUsImg} alt="About Us" className="md:w-1/2 w-full rounded-lg shadow-md" />
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-6 py-16" id="categories">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              to={`/category/${category.id}`}
              key={index}
              className="bg-white shadow-lg rounded-lg p-4 text-center transform hover:scale-105 transition border border-gray-200 hover:shadow-xl"
            >
              <img src={category.image} alt={category.name} className="w-full h-64 object-cover rounded-md" />
              <h3 className="mt-4 text-lg font-semibold text-gray-700">{category.name}</h3>
            </Link>
          ))}

          {/* Bulk Ordering Section - Takes 2 Columns */}
          <div className="bg-white shadow-lg md:col-span-2 p-10 rounded-lg border border-gray-200 text-gray-700 text-center hover:shadow-xl">
            <h3 className="text-5xl font-semibold text-gray-800 mb-5">Bulk Ordering Options</h3>
            <p className="text-lg">We offer bulk ordering options for businesses & institutions.</p>
            <p className="mt-2">Send your requirements and inquiries to:</p>
            <p className="font-medium mt-1">📧 <a href="mailto:info@zenlynxtechnologies.com" className="text-blue-600">info@zenlynxtechnologies.com</a></p>
            <p className="font-medium">📱 <a href="https://wa.me/7325966706" className="text-green-600">7325966706</a></p>
          </div>
        </div>
      </div>


      {/* Featured Products & Offers Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Featured Products & Offers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white shadow-lg rounded-lg p-4 text-center border border-gray-200 hover:shadow-xl">
              <img src={product.image} alt={product.name} className="w-full h-60 object-contain rounded-md" />
              <h3 className="mt-4 text-lg font-semibold text-gray-700">{product.name}</h3>
              <p className="text-blue-600 font-semibold">Special Discounts Available</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Valued Customers Section */}
      <div className="bg-gray-100 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Our Valued Customers</h2>
        <div className="flex justify-center gap-8 flex-wrap">
          {customers.map((customer, index) => (
            <img
              key={index}
              src={customer}
              alt={`Customer ${index + 1}`}
              className="h-20 md:h-24 object-contain grayscale hover:grayscale-0 transition"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;