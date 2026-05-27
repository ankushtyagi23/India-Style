import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { services } from '../data/services';

export default function Services() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q')?.toLowerCase() || '';

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(query) || 
    service.description.toLowerCase().includes(query)
  );

  return (
    <section id="services" className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white flex items-center gap-3">
              {query ? `Search Results for "${searchParams.get('q')}"` : 'Live Services'} <span role="img" aria-label="hammer">✂️</span>
            </h2>
          </motion.div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-gray-400 text-center py-12">
            No services found matching your search.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#181423]/50 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden hover:-translate-y-2 transition-transform duration-300 group shadow-lg flex flex-col"
              >
                <div className="p-4 relative">
                  <div className="w-full h-56 rounded-2xl overflow-hidden relative">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-black/60 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-5 pt-1 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white truncate pr-2">{service.title}</h3>
                    <div className="bg-purple-900/30 text-purple-400 text-xs font-semibold px-2 py-1 rounded whitespace-nowrap border border-purple-500/20">
                      {service.price}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-400 mb-6 border-b border-white/5 pb-4">
                    <div className="flex gap-2 items-center">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500"></div>
                      <span className="truncate">by {service.creator}</span>
                    </div>
                    <span className="text-xs text-gray-500">{service.stock}</span>
                  </div>
                  
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <Link to={`/booking?service=${service.id}`} className="bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-semibold py-2.5 rounded-full text-center hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-shadow">
                      Book Service
                    </Link>
                    <Link to={`/service/${service.id}`} className="bg-transparent border border-white/10 text-white text-xs font-semibold py-2.5 rounded-full text-center hover:bg-white/5 transition-colors">
                      View
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
