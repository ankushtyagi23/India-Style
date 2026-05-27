import { motion } from 'motion/react';
import { Wallet, Image, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    icon: <Wallet className="w-6 h-6 text-purple-400" />,
    title: "Choose Your Style",
    desc: "Browse our extensive gallery or consult with our master stylists to find a look that perfectly suits you.",
  },
  {
    icon: <Image className="w-6 h-6 text-purple-400" />,
    title: "Book Securely",
    desc: "Use our online booking system to find a slot that fits your schedule. Fast, seamless, and organized.",
  },
  {
    icon: <Tag className="w-6 h-6 text-purple-400" />,
    title: "Transform",
    desc: "Arrive at our modern studio, relax in our premium chairs, and let the artists do their work.",
  },
  {
    icon: <ArrowRight className="w-6 h-6 text-purple-400" />,
    title: "Step Out Fresh",
    desc: "Walk out with confidence, a crisp fade, and top-tier grooming products to maintain the look.",
  }
];

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-16 lg:gap-12 items-center">
        
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8 }}
           className="lg:col-span-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            How it works <span role="img" aria-label="point right">👉</span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-8 pr-4">
            Getting started and elevating your personal style is a seamless process. Explore the steps from booking to your brand new look without any confusion.
          </p>
          <Link
            to="/booking"
            className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-medium px-8 py-3 rounded-full transition-colors"
          >
            Learn More
          </Link>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="lg:col-span-8 grid sm:grid-cols-2 gap-6"
        >
           {steps.map((step, idx) => (
             <div key={idx} className="bg-[#130E20] border border-white/5 p-8 rounded-3xl hover:bg-[#181423] transition-colors group">
               <div className="bg-purple-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 {step.icon}
               </div>
               <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
               <p className="text-sm text-gray-400 leading-relaxed">
                 {step.desc}
               </p>
             </div>
           ))}
        </motion.div>

      </div>
    </section>
  );
}
