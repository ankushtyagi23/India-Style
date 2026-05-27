import React from 'react';
import { motion } from 'motion/react';
import { Star, MessageSquareQuote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Regular Client",
    content: "Absolutely amazing experience! The staff is professional and the atmosphere is so relaxing. I wouldn't go anywhere else.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "New Client",
    content: "First time visiting and I was blown away. The attention to detail and customer service is top notch.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "VIP Member",
    content: "I've been coming here for years. They always exceed my expectations. Highly recommended!",
    rating: 5,
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Regular Client",
    content: "Clean, modern facilities and a team that truly cares about your experience.",
    rating: 4,
  },
  {
    id: 5,
    name: "Jessica Martinez",
    role: "First-time Visitor",
    content: "Such a welcoming environment. The service was impeccable from start to finish.",
    rating: 5,
  },
];

export default function Reviews() {
  return (
    <section className="py-24 bg-[#090514] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16 text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 rounded-full px-4 py-2 mb-6 border border-white/10">
             <MessageSquareQuote className="text-purple-400 w-4 h-4" />
             <span className="text-white text-sm font-medium tracking-wide uppercase">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
             What Our Clients Say
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
             Don't just take our word for it. Hear from our wonderful clients about their experiences.
          </p>
        </motion.div>
      </div>

      <div className="relative w-full flex overflow-x-hidden group">
        <motion.div
          className="flex whitespace-nowrap gap-6 px-3"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30
          }}
        >
          {[...reviews, ...reviews, ...reviews].map((review, i) => (
            <div 
              key={`${review.id}-${i}`}
              className="w-[350px] shrink-0 bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors whitespace-normal"
            >
              <div className="flex text-purple-400 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 whitespace-pre-wrap mb-6 text-base leading-relaxed">"{review.content}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{review.name}</h4>
                  <span className="text-purple-400 text-sm">{review.role}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Gradient Fades */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#090514] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#090514] to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
