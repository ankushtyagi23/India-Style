import Gallery from '../components/Gallery';
import { motion } from 'motion/react';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#090514]">
      {/* Cinematic Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20 filter grayscale blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#090514]/80 via-[#090514]/50 to-[#090514]"></div>
        
        <div className="relative z-10 max-w-4xl px-6">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8 }}
           >
             <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tighter uppercase font-mono">
                Visual <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Archive</span>
             </h1>
             <p className="text-gray-400 text-lg md:text-xl font-medium tracking-wide">
                A curated collection of our finest transformations.
             </p>
           </motion.div>
        </div>
      </section>
      
      <Gallery />
    </div>
  );
}
