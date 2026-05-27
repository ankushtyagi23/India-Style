import Services from '../components/Services';
import { motion, useScroll, useTransform } from 'motion/react';
import React, { useRef } from 'react';

export default function ServicesPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  return (
    <div className="min-h-screen bg-[#090514]" ref={containerRef}>
      {/* 3D Haircut Hero */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[#090514] z-0"></div>
        <motion.div style={{ y }} className="absolute inset-0 w-full h-full z-0 opacity-40">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-purple-800 to-pink-600 rounded-full blur-[150px] mix-blend-screen mix-blend-color-dodge"></div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500 mb-6 leading-tight">
               Precision <br/> Services
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-md">
               From sharp fades to vivid color transformations. Experience the future of grooming in full spectrum.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ perspective: 1000 }}
            className="relative mx-auto w-full max-w-md"
          >
            <motion.div 
               animate={{ rotateY: [0, 10, -10, 0], y: [0, -15, 15, 0] }}
               transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
               className="relative rounded-3xl overflow-hidden border border-white/20 shadow-[0_0_80px_rgba(168,85,247,0.3)] bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md p-2"
            >
              <img 
                 src="https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?auto=format&fit=crop&q=80&w=800"
                 alt="3D Hair Cut Style"
                 className="w-full rounded-2xl object-cover h-[400px]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 rounded-2xl"></div>
              
              {/* Floating UI Elements */}
              <motion.div 
                 animate={{ y: [-5, 5, -5] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl"
              >
                 <span className="text-xs text-purple-300 block mb-1">PRO SERVICE</span>
                 <span className="text-white font-bold">VIRTUAL RENDER</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="relative bg-[#090514] z-20">
        <Services />
      </div>
    </div>
  );
}
