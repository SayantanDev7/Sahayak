import React from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Process = () => {
  const { t } = useLanguage();

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
        {t.process.tagline}
      </h3>
      <h2 className="text-5xl font-bold mb-16 leading-tight max-w-2xl">
        {t.process.title}
      </h2>

      <div className="flex flex-col lg:flex-row gap-16 relative">
        
        {/* Left Column (Scrolling Text) */}
        <div className="w-full lg:w-1/2 flex flex-col gap-24 py-10">
          <div>
            <h3 className="text-3xl font-bold mb-4 text-white">{t.process.steps[0].title}</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              {t.process.steps[0].desc}
            </p>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-4 text-white">{t.process.steps[1].title}</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              {t.process.steps[1].desc}
            </p>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-4 text-white">{t.process.steps[2].title}</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              {t.process.steps[2].desc}
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
