import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">

        {/* Our Products Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Our Products</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/category/document-printing" className="hover:text-white">Document Printing</Link></li>
            <li><Link to="/category/visiting-cards" className="hover:text-white">Visiting Cards</Link></li>
            <li><Link to="/category/book-printing" className="hover:text-white">Book Printing</Link></li>
            <li><Link to="/category/letterhead-printing" className="hover:text-white">Letterhead Printing</Link></li>
            <li><Link to="/category/certificate-printing" className="hover:text-white">Certificate Printing</Link></li>
            <li><Link to="/category/poster-printing" className="hover:text-white">Poster Printing</Link></li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/faqs" className="hover:text-white">FAQs</Link></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link to="/policies" className="hover:text-white">Policies</Link></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <p className="text-gray-400">📍 123 Printing Street, Ghaziabad, India</p>
          <p className="text-gray-400">📞 <a href="tel:+917325966706" className="hover:text-white">+91 73259 66706</a></p>
          <p className="text-gray-400">📧 <a href="mailto:info@zenlynxtechnologies.com" className="hover:text-white">info@zenlynxtechnologies.com</a></p>
        </div>

        {/* Payment & Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white"><FaFacebook size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><FaInstagram size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><FaTwitter size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><FaLinkedin size={24} /></a>
          </div>
          <h3 className="text-xl font-semibold mt-6 mb-4">We Accept</h3>
          <p className="text-gray-400">Visa | MasterCard | PayPal | UPI | Net Banking</p>
        </div>

      </div>

      {/* Copyright Section */}
      <div className="mt-8 text-center border-t border-gray-700 pt-4">
        <p className="text-gray-500">© {new Date().getFullYear()} PrintZet. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
