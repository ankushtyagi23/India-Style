import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden min-h-[90vh] flex flex-col justify-center">
      {/* Dark theme background glowing blobs */}
      <div className="absolute top-0 right-0 md:w-[800px] md:h-[800px] w-full h-[500px] bg-purple-900/30 blur-[150px] rounded-full -z-10 pointer-events-none translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-pink-900/20 blur-[120px] rounded-full -z-10 pointer-events-none -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Content Area */}
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05] mb-6">
            Discover, <br/>
            transform and <br/>
            own <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">your look</span>
          </h1>

          <p className="text-gray-400 text-lg max-w-lg mb-10 leading-relaxed">
            The city's hottest salon for premium haircuts, vivid coloring, and elite grooming experiences. Book your transformation today.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-16">
            <Link
              to="/services"
              className="inline-flex justify-center items-center bg-gradient-to-r from-purple-600 to-purple-500 text-white text-base font-semibold px-8 py-3.5 rounded-full hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all transform hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Explore Services
            </Link>
            <Link
              to="/gallery"
              className="inline-flex justify-center items-center border border-gray-600 text-white bg-white/5 hover:bg-white/10 text-base font-semibold px-8 py-3.5 rounded-full transition-all w-full sm:w-auto"
            >
              View Gallery
            </Link>
          </div>
        </motion.div>

        {/* Right Image/Card Area - Simulating the 3D head/neon vibe */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
           animate={{ opacity: 1, scale: 1, rotate: 0 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          {/* Main Visual */}
          <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.15)] group">
             <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 to-transparent mix-blend-overlay z-10 group-hover:opacity-75 transition-opacity duration-500"></div>
             <img 
               src="/hero.jpg" 
               alt="Hero Vibe" 
               className="w-full h-[500px] lg:h-[700px] object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
             />
             
             {/* Neon light effect overlay */}
             <div className="absolute top-[20%] right-[-10%] w-32 h-64 bg-pink-500/40 blur-[50px] -rotate-45 z-20 pointer-events-none"></div>
             
             {/* Info overlay card similar to NFT bid card */}
             <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 z-30">
                <div className="flex justify-between flex-wrap gap-4 items-end">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Current Vibe</div>
                    <div className="text-2xl font-bold text-purple-400">Neon Glamour</div>
                    <div className="text-sm text-gray-300 mt-1">Full transformation</div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs text-gray-400 mb-1">Next Slot Available</div>
                    <div className="flex gap-2 text-xl font-bold text-white">
                      <div>12 <span className="text-xs font-normal text-gray-400">Hours</span></div>
                      <div>:</div>
                      <div>45 <span className="text-xs font-normal text-gray-400">Mins</span></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to="/booking" className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">Book Now</Link>
                  </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
