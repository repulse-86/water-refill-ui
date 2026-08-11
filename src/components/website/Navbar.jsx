import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <span className="text-3xl">💧</span>
          <span>AquaPure</span>
        </Link>
        <ul className="flex space-x-6 font-medium">
          <li><Link to="/" className="hover:text-blue-200 transition">Home</Link></li>
          <li><Link to="/services" className="hover:text-blue-200 transition">Services</Link></li>
          <li><Link to="/pricing" className="hover:text-blue-200 transition">Pricing</Link></li>
          <li><Link to="/contact" className="hover:text-blue-200 transition">Contact</Link></li>
        </ul>
        <div>
          <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}