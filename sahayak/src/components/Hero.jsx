import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionLink = motion(Link);

export const Hero = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden pt-20 font-sans"
    >
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#ccff00] opacity-20 blur-[100px] rounded-full -translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ccff00] opacity-20 blur-[100px] rounded-full translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

      {/* Small Top Badge */}
      <div className="border border-white/20 text-gray-300 rounded-full px-4 py-1.5 text-sm mb-8 inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm z-10">
        <ShieldCheck size={16} className="text-[#ccff00]" />
        Trusted platform for 1M+ Citizens
      </div>

      {/* Main Headline */}
      <h1 className="text-white text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] max-w-5xl mb-6 z-10">
        GOVERNMENT SCHEMES IN <br className="hidden md:block" />
        <span className="text-transparent" style={{ WebkitTextStroke: '1px white', textShadow: '0 0 30px rgba(204,255,0,0.15)' }}>
          EVERY PIXEL
        </span>
      </h1>

      {/* Sub-headline */}
      <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto mb-10 z-10">
        We craft stunningly easy pathways for citizens to discover and apply for schemes.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 z-10">
        <MotionLink 
          to="/explore" 
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          className="bg-white text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-[#ccff00] transition-colors inline-block"
        >
          Explore Schemes
        </MotionLink>
        <motion.button 
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => document.getElementById('process-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="border border-white/30 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-colors backdrop-blur-sm"
        >
          Know More
        </motion.button>
      </div>
    </motion.div>
  );
};
