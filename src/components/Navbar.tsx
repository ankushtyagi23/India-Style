import React, { useState, useEffect } from 'react';
import { Menu, X, Search, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import IndiaFlag from './IndiaFlag';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled ? 'bg-[#090514]/80 backdrop-blur-xl border-white/5 py-3' : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center space-x-12">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight text-white flex items-center">
              <IndiaFlag className="w-8 h-6 mr-3 shadow-md rounded-sm" /> India Style
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-300">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                className={`transition-colors ${location.pathname === link.href ? 'text-purple-400' : 'hover:text-purple-400'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Nav Options */}
        <div className="hidden lg:flex items-center space-x-6">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-purple-500" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..." 
              className="w-32 lg:w-36 xl:w-48 bg-transparent border border-gray-700/50 rounded-full py-1.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors focus:bg-white/5"
            />
          </form>
          
          {user ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors mr-2"
                >
                  Admin Portal
                </Link>
              )}
              <Link
                to="/my-bookings"
                className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
              >
                My Bookings
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              title="Login"
              className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
          )}
          
          <Link
            to="/booking"
            className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-400 text-white text-sm font-semibold px-6 py-2 rounded-full hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all transform hover:-translate-y-0.5"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 text-gray-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-[#0F0A1F] border-b border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="p-6 flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="relative group mb-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services..." 
                  className="w-full bg-[#181423] border border-gray-700/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </form>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-medium py-2 border-b border-white/5 ${location.pathname === link.href ? 'text-purple-400' : 'text-gray-300 hover:text-purple-400'}`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="grid grid-cols-2 gap-3 pt-4">
                {user ? (
                   <>
                     {isAdmin && (
                       <Link
                          to="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-center w-full col-span-2 bg-[#181423] border border-purple-500/30 text-purple-400 text-sm font-semibold px-4 py-3 rounded-xl shadow-sm"
                       >
                         Admin Portal
                       </Link>
                     )}
                     <Link
                        to="/my-bookings"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center w-full bg-[#181423] border border-white/10 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-sm"
                     >
                       My Bookings
                     </Link>
                     <button
                       onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                       className="flex items-center justify-center w-full bg-[#181423] border border-red-500/10 text-red-400 text-sm font-semibold px-4 py-3 rounded-xl shadow-sm"
                     >
                       Logout
                     </button>
                   </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full col-span-2 bg-[#181423] border border-white/10 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-sm"
                  >
                    Login / Sign Up
                  </Link>
                )}
                <Link
                  to="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-center w-full bg-gradient-to-r from-purple-600 to-purple-400 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] ${user ? 'col-span-2' : 'col-span-2'}`}
                >
                  Book Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
