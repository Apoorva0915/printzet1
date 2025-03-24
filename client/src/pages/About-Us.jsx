// About Us Page
import aboutImg from "../assets/about-us.jpg";
const customers = [
    "/images/Customer1.png",
    "/images/Customer2.png",
    "/images/Customer3.png",
    "/images/Customer4.png",
  ];

const About = () => {
  return (
    <div className="bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <img src={aboutImg} alt="About Us" className="w-full rounded-lg shadow-lg" />
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">The Story Behind PrintZet</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            PrintZet was founded with a vision to revolutionize the printing industry by providing high-quality, fast, and affordable printing solutions. We believe in innovation and customer satisfaction as our core principles.
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-16 text-center">
        <h3 className="text-3xl font-bold text-gray-800">Our Commitment to Quality & Fast Service</h3>
        <p className="text-gray-600 mt-4 max-w-3xl mx-auto text-lg leading-relaxed">
          We use premium materials, cutting-edge printing technology, and a streamlined ordering process to ensure a seamless experience for our customers.
        </p>
      </div>
      <div className="max-w-6xl mx-auto mt-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-3xl font-bold text-gray-800">Customer Success Stories</h3>
          <p className="text-gray-600 mt-4 text-lg leading-relaxed">
            Thousands of businesses and individuals trust PrintZet for their printing needs. From corporate branding to personal projects, we deliver excellence every time.
          </p>
        </div>
        <div className="py-16">
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
    </div>
  );
};

export default About;
