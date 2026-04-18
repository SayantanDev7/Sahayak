import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export const About = () => {
  const { t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-6xl mx-auto py-20 flex flex-col md:flex-row gap-16 px-4 font-sans items-center"
    >
      <div className="w-full md:w-1/2">
        <h2 className="text-4xl text-[#1a5f42] font-extrabold mb-6">{t.about.title}</h2>
        <div className="text-gray-700 space-y-4 mb-8 text-lg">
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
          <p>{t.about.p3}</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#213b7e] hover:bg-[#152759] transition-colors text-white px-8 py-3 rounded font-medium shadow inline-block"
        >
          {t.about.btn}
        </motion.button>
      </div>
      
      <div className="w-full md:w-1/2">
        <div className="bg-[#5ebd7f] rounded-xl w-full aspect-video flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#4ea86e] transition-colors group">
          <div className="bg-white/30 p-4 rounded-full group-hover:scale-110 transition-transform">
            <Play fill="white" size={64} className="text-white ml-2" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
