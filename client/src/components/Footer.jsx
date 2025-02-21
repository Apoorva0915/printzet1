import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Our Products Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Our Products</h3>
          <ul className="space-y-2">
            <li><Link to="/category/document-printing" className="hover:text-gray-400">Document Printing</Link></li>
            <li><Link to="/category/visiting-cards" className="hover:text-gray-400">Visiting Cards</Link></li>
            <li><Link to="/category/book-printing" className="hover:text-gray-400">Book Printing</Link></li>
            <li><Link to="/category/letterhead-printing" className="hover:text-gray-400">Letterhead Printing</Link></li>
            <li><Link to="/category/certificate-printing" className="hover:text-gray-400">Certificate Printing</Link></li>
            <li><Link to="/category/poster-printing" className="hover:text-gray-400">Poster Printing</Link></li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-gray-400">Home</Link></li>
            <li><Link to="/" className="hover:text-gray-400">Services</Link></li>
            <li><Link to="/" className="hover:text-gray-400">Categories</Link></li>
            <li><Link to="/" className="hover:text-gray-400">About Us</Link></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <p className="text-gray-400">📍 123 Printing Street, Ghaziabad, India</p>
          <p className="text-gray-400">📞 +91 98765 43210</p>
          <p className="text-gray-400">📧 support@printecom.com</p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 text-center border-t border-gray-700 pt-4">
        <p className="text-gray-500">© {new Date().getFullYear()} PrintEcom. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
