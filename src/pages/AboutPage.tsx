import About from '../components/About';
import { motion } from 'motion/react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#090514] overflow-hidden">
      {/* Animated Hero */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-br from-purple-900/30 via-transparent to-transparent"></div>
            <motion.div 
               animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
               transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-20 right-10 md:right-32 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]"
            />
            <motion.div 
               animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
               transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
               className="absolute bottom-10 left-10 md:left-32 w-80 h-80 bg-pink-600/10 rounded-full blur-[100px]"
            />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-semibold tracking-wider uppercase"
          >
            The India Style Story
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-tight"
          >
            Redefining <br/> Grooming Art.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed"
          >
            We blend classic techniques with neo-futuristic styling to bring out the boldest version of you.
          </motion.p>
        </div>
      </section>

      <div className="relative z-10">
        <About />
      </div>
    </div>
  );
}
