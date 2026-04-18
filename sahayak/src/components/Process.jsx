import React from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

export const Process = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      id="process-section" 
      className="max-w-7xl mx-auto py-24 px-8 text-white relative font-sans"
    >
      <h3 className="text-[#ccff00] text-sm font-bold tracking-widest mb-4 uppercase">
        Our Process, Your Advantage
      </h3>
      <h2 className="text-5xl font-bold mb-16 leading-tight max-w-2xl">
        From Search To Application
      </h2>

      <div className="flex flex-col lg:flex-row gap-16 relative">
        
        {/* Left Column (Scrolling Text) */}
        <div className="w-full lg:w-1/2 flex flex-col gap-24 py-10">
          <div>
            <h3 className="text-3xl font-bold mb-4 text-white">01 Discovery</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Our intelligent engine matches your unique profile against thousands of state and central schemes, ensuring you never miss out on benefits you rightfully deserve.
            </p>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-4 text-white">02 Smart Upload</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              No more manual cropping or format conversions. Upload your documents once, and our smart system auto-resizes and formats them to meet exact government portal requirements.
            </p>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-4 text-white">03 Track Status</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Keep an eye on all your ongoing applications from a single, unified dashboard. Receive real-time alerts and updates without checking multiple portals.
            </p>
          </div>
        </div>

        {/* Right Column (Sticky Images) */}
        <div className="hidden lg:flex w-1/2 sticky top-32 h-[500px] rounded-3xl bg-[#141414] border border-white/10 overflow-hidden items-center justify-center p-8 shadow-2xl">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative flex items-center justify-center"
          >
            {/* Glowing background behind icon */}
            <div className="absolute inset-0 bg-[#ccff00] opacity-20 blur-3xl rounded-full scale-150 pointer-events-none"></div>
            <Cpu className="text-[#ccff00] w-32 h-32 relative z-10 drop-shadow-[0_0_15px_rgba(204,255,0,0.5)]" strokeWidth={1} />
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};
