import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import categories from "../data/categories";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import slider1Img from "../assets/home-slider/fancy-walls-wallpaper-EmKw1q2QcIM-unsplash.jpg";
import slider2Img from "../assets/home-slider/geri-sakti-KAO2-CRZXTE-unsplash.jpg";
import slider3Img from "../assets/home-slider/kelly-sikkema-8DEDp6S93Po-unsplash.jpg";
import aboutUsImg from "../assets/about-us.jpg";

const customers = [
  "/images/Customer1.png",
  "/images/Customer2.png",
  "/images/Customer3.png",
  "/images/Customer4.png",
];

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Carousel Section */}
      <div className="w-full h-[500px] md:h-[450px] lg:h-[550px]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          className="w-full h-full"
        >
          <SwiperSlide className="flex justify-center items-center">
            <img src={slider1Img} alt="Slide 1"  className="w-auto h-[500px] md:h-[450px] lg:h-[550px] object-contain mx-auto" />
          </SwiperSlide>
          <SwiperSlide className="flex justify-center items-center">
            <img src={slider2Img} alt="Slide 2"  className="w-auto h-[500px] md:h-[450px] lg:h-[550px] object-contain mx-auto" />
          </SwiperSlide>
          <SwiperSlide className="flex justify-center items-center">
            <img src={slider3Img} alt="Slide 3"  className="w-auto h-[500px] md:h-[450px] lg:h-[550px] object-contain mx-auto" />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">About PrintEcom</h2>
          <p className="text-gray-600 leading-relaxed">
            PrintEcom is your one-stop destination for all printing needs. We offer high-quality printing solutions,
            from documents to posters, business cards, and more. Experience fast, reliable, and cost-effective printing services with us!
          </p>
          <Link to="/about" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Learn More
          </Link>
        </div>
        <img src={aboutUsImg} alt="About Us" className="md:w-1/2 w-full rounded-lg shadow-md" />
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Our Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              to={`/category/${category.id}`}
              key={index}
              className="bg-white shadow-md rounded-lg p-4 text-center transform hover:scale-105 transition border border-gray-200"
            >
              <img src={category.image} alt={category.name} className="w-full h-60 object-cover rounded-md" />
              <h3 className="mt-4 text-lg font-semibold text-gray-700">{category.name}</h3>
            </Link>
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
              className="h-16 md:h-24 object-contain grayscale hover:grayscale-0 transition"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
