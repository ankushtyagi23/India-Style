import React from 'react';
import { motion } from 'motion/react';
import { Users, Award, Clock, Star } from 'lucide-react';

const stats = [
  { id: 1, name: 'Happy Clients', value: '10K+', icon: Users },
  { id: 2, name: 'Years Experience', value: '15+', icon: Clock },
  { id: 3, name: 'Expert Professionals', value: '50+', icon: Award },
  { id: 4, name: 'Client Rating', value: '4.9/5', icon: Star },
];

export default function Stats() {
  return (
    <section className="py-20 relative overflow-hidden bg-[#090514] border-t border-white/5 border-b">
      {/* Background ambient light */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-blue-900/10 opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, type: "spring", bounce: 0.4 }}
                className="text-center group flex flex-col items-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-[0_0_20px_rgba(168,85,247,0.1)] group-hover:bg-white/10 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300">
                  <Icon className="w-7 h-7 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </div>
                <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-gray-400 font-medium text-sm md:text-base uppercase tracking-wider">
                  {stat.name}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
