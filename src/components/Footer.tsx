import { Twitter, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import IndiaFlag from './IndiaFlag';

export default function Footer() {
  return (
    <footer className="bg-[#0b0813] border-t border-white/5 text-white py-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12 border-b border-white/5 pb-12">
        
        <div className="lg:col-span-2">
          <div className="text-2xl font-bold tracking-tight mb-4 flex items-center">
            <IndiaFlag className="w-8 h-6 mr-3 shadow-md rounded-sm" /> India Style.
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
            The city's largest premium destination for hair styling, vivid color transformations and exclusive grooming services.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600 transition-all">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600 transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600 transition-all">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6">Explore</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link to="/services" className="hover:text-purple-400 transition-colors">Haircuts</Link></li>
            <li><Link to="/gallery" className="hover:text-purple-400 transition-colors">Photography</Link></li>
            <li><Link to="/services" className="hover:text-purple-400 transition-colors">Styling</Link></li>
            <li><Link to="/services" className="hover:text-purple-400 transition-colors">Treatments</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-6">Navigation</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-purple-400 transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-purple-400 transition-colors">About</Link></li>
            <li><Link to="/gallery" className="hover:text-purple-400 transition-colors">Gallery</Link></li>
            <li><Link to="/contact" className="hover:text-purple-400 transition-colors">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-6">Resources</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link to="/contact" className="hover:text-purple-400 transition-colors">Help Centre</Link></li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">Partners</a></li>
            <li><Link to="/contact" className="hover:text-purple-400 transition-colors">Suggestions</Link></li>
            <li><Link to="/booking" className="hover:text-purple-400 transition-colors">Booking</Link></li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-xs text-gray-600 text-center md:text-left">
        © {new Date().getFullYear()} India Style. All rights reserved.
      </div>
    </footer>
  );
}
