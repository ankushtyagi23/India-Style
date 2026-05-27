import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = ["All Styles", "Modern Cuts", "Vivid Colors", "Beards", "Event Ready"];

const works = [
  { img: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&q=80", title: "Clean Fade", likes: "12k" },
  { img: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&q=80", title: "Textured Crop", likes: "8k" },
  { img: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500&q=80", title: "Beard Sculpture", likes: "15k" },
  { img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80", title: "Neon Pink Toss", likes: "24k" },
  { img: "https://images.unsplash.com/photo-1516975080665-ed41b528b1ae?w=500&q=80", title: "Classic Pompadour", likes: "9k" },
  { img: "https://images.unsplash.com/photo-1598524374912-6a6d63e9da5b?w=500&q=80", title: "Icy Blonde", likes: "32k" },
  { img: "https://images.unsplash.com/photo-1559599507-6c2e3bf4a34b?w=500&q=80", title: "Modern Mullet", likes: "5k" },
  { img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80", title: "Buzz Art", likes: "11k" },
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white flex items-center gap-3">
              Hot Collection <span role="img" aria-label="fire">🔥</span>
            </h2>
          </motion.div>
          
          <Link to="/gallery" className="text-purple-400 font-medium flex items-center hover:text-purple-300 transition-colors">
            View All <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {/* Filter Tags */}
        <div className="flex gap-4 overflow-x-auto pb-6 mb-8 scrollbar-hide">
          {categories.map((cat, i) => (
             <button key={i} className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-colors ${i === 0 ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'bg-[#181423] text-gray-400 border border-white/5 hover:bg-white/5'}`}>
               {cat}
             </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {works.map((work, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: (idx % 4) * 0.1 }}
               className="group cursor-pointer"
             >
                <div className="w-full aspect-[4/5] overflow-hidden rounded-2xl relative mb-3">
                  <img src={work.img} alt={work.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex justify-between items-center px-1">
                  <h4 className="text-sm font-semibold text-white truncate">{work.title}</h4>
                  <div className="flex items-center text-xs text-gray-400">
                    <svg className="w-3 h-3 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    {work.likes}
                  </div>
                </div>
             </motion.div>
          ))}
        </div>
        
        <div className="mt-12 flex justify-center">
           <button className="bg-[#181423] border border-white/10 text-white hover:bg-white/5 transition-colors px-8 py-3 rounded-full text-sm font-semibold">
             Load More
           </button>
        </div>
      </div>
    </section>
  );
}
