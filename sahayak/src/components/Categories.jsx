import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { 
  Tractor, 
  Landmark, 
  Briefcase, 
  GraduationCap, 
  HeartPulse, 
  Home, 
  Scale, 
  Cpu, 
  Wrench, 
  Users, 
  Trophy, 
  Train, 
  Map, 
  Droplet, 
  Baby 
} from 'lucide-react';

const categoryData = [
  { name: "Agriculture, Rural & Environment", count: "834", icon: Tractor },
  { name: "Banking, Financial Services and Insurance", count: "326", icon: Landmark },
  { name: "Business & Entrepreneurship", count: "741", icon: Briefcase },
  { name: "Education & Learning", count: "1082", icon: GraduationCap },
  { name: "Health & Wellness", count: "287", icon: HeartPulse },
  { name: "Housing & Shelter", count: "133", icon: Home },
  { name: "Public Safety, Law & Justice", count: "33", icon: Scale },
  { name: "Science, IT & Communications", count: "109", icon: Cpu },
  { name: "Skills & Employment", count: "395", icon: Wrench },
  { name: "Social welfare & Empowerment", count: "1432", icon: Users },
  { name: "Sports & Culture", count: "258", icon: Trophy },
  { name: "Transport & Infrastructure", count: "99", icon: Train },
  { name: "Travel & Tourism", count: "97", icon: Map },
  { name: "Utility & Sanitation", count: "58", icon: Droplet },
  { name: "Women and Child", count: "464", icon: Baby }
];

export const Categories = () => {
  const { t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full py-24 px-8 max-w-7xl mx-auto font-sans bg-[#0a0a0a]"
    >
      <h2 className="text-white text-4xl md:text-5xl font-bold mb-16 text-center leading-tight">
        {t.categories.title}
      </h2>

      <motion.div 
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {categoryData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div 
              key={index}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#141414] border border-white/5 rounded-3xl p-6 group cursor-pointer hover:border-[#ccff00]/50 transition-colors flex flex-col items-center text-center"
            >
              <div className="bg-white/5 p-4 rounded-full mb-4 group-hover:bg-[#ccff00]/10 transition-colors">
                <IconComponent size={32} className="text-white group-hover:text-[#ccff00] transition-colors" strokeWidth={1.5} />
              </div>
              <p className="text-[#ccff00] text-sm font-bold tracking-wider mb-2">
                {item.count} {t.categories.schemes}
              </p>
              <h4 className="text-white text-lg font-semibold leading-snug">
                {t.categories.items[index]?.name || item.name}
              </h4>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};
