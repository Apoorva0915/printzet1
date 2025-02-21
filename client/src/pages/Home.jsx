import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import categories from "../data/categories";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import slider1Img from "../assets/home-slider/fancy-walls-wallpaper-EmKw1q2QcIM-unsplash.jpg";
import slider2Img from "../assets/home-slider/geri-sakti-KAO2-CRZXTE-unsplash.jpg";
import slider3Img from "../assets/home-slider/kelly-sikkema-8DEDp6S93Po-unsplash.jpg" 
import aboutUsImg from "../assets/about-us.jpg";


const customers = [
    "/images/Customer1.png",
    "/images/Customer2.png",
    "/images/Customer3.png",
    "/images/Customer4.png",
];

const Home = () => {
    return (
        <div className="">
            {/* Carousel Section */}
            <div className="w-full h-[600px] md:h-96"> 
    <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        className="w-full h-[500px]"
    >
        <SwiperSlide>
            <img src={slider1Img} alt="Slide 1" className="w-full h-full object-center" />
        </SwiperSlide>
        <SwiperSlide>
            <img src={slider2Img} alt="Slide 2" className="w-full h-full object-center" />
        </SwiperSlide>
        <SwiperSlide>
            <img src={slider3Img} alt="Slide 3" className="w-full h-full object-center" />
        </SwiperSlide>
    </Swiper>
</div>

            {/* About Section */}
            <div className="container mx-auto px-6 py-40 flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold mb-4">About PrintEcom</h2>
                    <p className="text-gray-700">
                        PrintEcom is your one-stop destination for all printing needs. We offer high-quality printing solutions,
                        from documents to posters, business cards, and more. Experience fast, reliable, and cost-effective printing services with us!
                    </p>
                </div>
                <img src={aboutUsImg} alt="About Us" className="md:w-1/2 w-full" />
            </div>

            {/* Categories Section */}
            <h2 className="mx-auto px-6 text-3xl font-bold mb-4">Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                    <Link to={`/category/${category.id}`} key={index} className="bg-white shadow-lg rounded-lg p-4 text-center transform hover:scale-105 transition">
                        <img src={category.image} alt={category.name} className="w-full h-60 object-cover rounded-md" />
                        <h3 className="mt-4 text-lg font-semibold">{category.name}</h3>
                    </Link>
                ))}
            </div>

            {/* Our Valued Customers Section */}
            <div className="bg-gray-100 py-10">
                <h2 className="text-3xl font-bold text-center mb-6">Our Valued Customers</h2>
                <div className="flex justify-center gap-6 flex-wrap">
                    {customers.map((customer, index) => (
                        <img key={index} src={customer} alt={`Customer ${index + 1}`} className="h-16 md:h-24 object-contain" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
