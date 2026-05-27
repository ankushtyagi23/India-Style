import { Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#090514] text-white overflow-hidden">
      
      {/* Animated Hero */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 px-6 border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-tr from-purple-900/40 to-blue-900/40 blur-[120px] rounded-full z-0 opacity-50 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
            <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.7 }}
               className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6"
            >
              Let's <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Connect</span>
            </motion.h1>
            <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.7, delay: 0.1 }}
               className="text-gray-400 max-w-xl mx-auto text-lg"
            >
               Questions? Ready to book a VIP session? Drop us a line and our team will get back to you.
            </motion.p>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16">
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="lg:w-5/12 space-y-10"
          >
            <div className="flex items-start group">
              <div className="bg-[#181423] p-4 rounded-2xl mr-6 border border-white/5 group-hover:border-purple-500/50 transition-colors">
                <MapPin className="text-purple-400 w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Our Studio</h3>
                <p className="text-gray-400">123 Style Avenue, MG Road</p>
                <p className="text-gray-400">Gurugram, HR 122001, India</p>
              </div>
            </div>
            
            <div className="flex items-start group">
              <div className="bg-[#181423] p-4 rounded-2xl mr-6 border border-white/5 group-hover:border-purple-500/50 transition-colors">
                <Phone className="text-purple-400 w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Call Us directly</h3>
                <p className="text-gray-400 text-lg">+91 98765 43210</p>
                <p className="text-purple-400 text-sm mt-1">Available 9:00 AM - 9:00 PM</p>
              </div>
            </div>
            
            <div className="flex items-start group">
              <div className="bg-[#181423] p-4 rounded-2xl mr-6 border border-white/5 group-hover:border-purple-500/50 transition-colors">
                <Mail className="text-purple-400 w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Email Desk</h3>
                <p className="text-gray-400">hello@indiastyle.com</p>
                <p className="text-gray-500 text-sm mt-1">We reply within 24 hours</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 h-64 w-full">
              <iframe 
                src="https://maps.google.com/maps?q=20%C2%B010'28.7%22N%2072%C2%B046'04.0%22E&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(100%)', outline: 'none' }} 
                className="focus:outline-none focus:ring-0 active:outline-none"
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="lg:w-7/12 bg-[#130E20]/50 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem]"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">First Name</label>
                  <input required type="text" className="w-full bg-[#181423] border border-white/5 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-purple-500 transition-colors" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">Last Name</label>
                  <input required type="text" className="w-full bg-[#181423] border border-white/5 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-purple-500 transition-colors" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">Email Address</label>
                <input required type="email" className="w-full bg-[#181423] border border-white/5 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-purple-500 transition-colors" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">Message</label>
                <textarea required rows={5} className="w-full bg-[#181423] border border-white/5 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-purple-500 transition-colors custom-scrollbar"></textarea>
              </div>

              <button type="button" className="w-full bg-white text-purple-950 font-bold uppercase tracking-widest text-sm py-4 rounded-xl hover:bg-gray-200 transition-all">
                Send Transmission
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
