import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { services } from '../data/services';

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const service = services.find(s => s.id === id);

  if (!service) {
    return (
      <div className="pt-32 min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-bold text-white mb-4">Service Not Found</h1>
        <p className="text-gray-400 mb-8">The service you're looking for doesn't exist or has been removed.</p>
        <Link to="/services" className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-full transition-colors">
          Browse All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#090514] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Link to="/services" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
        </Link>
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-3xl relative border border-white/10"
          >
            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-block bg-purple-900/30 text-purple-400 font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-6 border border-purple-500/20">
              {service.creator}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
            <div className="text-3xl font-bold text-purple-400 mb-8">{service.price}</div>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {service.description}
            </p>
            
            <div className="bg-[#181423] border border-white/5 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 border-b border-white/5 pb-4">Service Details</h3>
              <ul className="space-y-4">
                <li className="flex items-start text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 mr-3 shrink-0" />
                  <span>Performed by {service.creator}</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 mr-3 shrink-0" />
                  <span>Premium imported products used</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 mr-3 shrink-0" />
                  <span>{service.stock}</span>
                </li>
              </ul>
            </div>
            
            <div className="flex gap-4">
              <Link to={`/booking?service=${service.id}`} className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-4 rounded-xl text-center hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all transform hover:-translate-y-1">
                Book This Service
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
