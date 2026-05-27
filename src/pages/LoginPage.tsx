import { motion } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import IndiaFlag from '../components/IndiaFlag';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      const destination = location.state?.from?.pathname + (location.state?.from?.search || '') || '/booking';
      navigate(destination, { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#090514] text-white flex items-center justify-center relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 blur-[150px] rounded-full -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 blur-[150px] rounded-full -z-10 pointer-events-none"></div>

      <div className="w-full max-w-md px-6 z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="bg-[#181423]/50 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-2xl"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-2xl font-bold tracking-tight text-white mb-6">
              <IndiaFlag className="w-8 h-6 mr-3 shadow-md rounded-sm" /> India Style.
            </Link>
            <h1 className="text-2xl font-bold mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
            <p className="text-gray-400 text-sm">{isSignUp ? 'Join us to book your sessions' : 'Enter your credentials to access your account'}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">{error}</div>}
            
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input required type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0F0A1F] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-medium">Password</label>
                {!isSignUp && <a href="#" className="text-xs text-purple-400 hover:text-purple-300">Forgot?</a>}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input required type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0F0A1F] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full mt-6 flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50">
              {isSignUp ? <UserPlus className="w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
            
            <p className="text-center text-sm text-gray-400 mt-6">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"} <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-purple-400 hover:text-purple-300 font-medium">{isSignUp ? 'Sign In' : 'Create one'}</button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
