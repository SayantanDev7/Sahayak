import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export const Marquee = () => {
  const { t } = useLanguage();
  const text = t.marquee.text;
  
  // Duplicate the text multiple times to ensure the marquee has enough length to loop seamlessly
  const marqueeContent = Array(10).fill(text).join('');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full py-10 border-y border-white/10 bg-[#0a0a0a] overflow-hidden flex whitespace-nowrap font-sans"
    >
      <motion.div 
        className="flex"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        <span className="text-gray-500 text-sm font-bold tracking-widest uppercase mx-8 inline-block">
          {marqueeContent}
        </span>
      </motion.div>
    </motion.div>
  );
};
