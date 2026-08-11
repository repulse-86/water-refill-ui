export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">AquaPure</h3>
          <p className="text-sm">Pure water, delivered to your doorstep. Trusted by thousands.</p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">Services</a></li>
            <li><a href="#" className="hover:text-white">Pricing</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-3">Contact Info</h4>
          <ul className="space-y-2 text-sm">
            <li>📍 123 Water Lane, City</li>
            <li>📞 +63 912 345 6789</li>
            <li>✉️ hello@aquapure.com</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-3">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white">FB</a>
            <a href="#" className="hover:text-white">IG</a>
            <a href="#" className="hover:text-white">TW</a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs mt-6 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} AquaPure. All rights reserved.
      </div>
    </footer>
  );
}