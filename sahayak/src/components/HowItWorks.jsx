import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: FileText, title: t.howItWorks.steps[0].title, desc: t.howItWorks.steps[0].desc },
    { icon: Search, title: t.howItWorks.steps[1].title, desc: t.howItWorks.steps[1].desc },
    { icon: CheckCircle, title: t.howItWorks.steps[2].title, desc: t.howItWorks.steps[2].desc }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#f8fafc] py-20 flex flex-col items-center px-4 font-sans w-full"
    >
      <h2 className="text-4xl font-extrabold text-black mb-16 text-center">
        {t.howItWorks.title}
      </h2>
      <div className="flex flex-col md:flex-row gap-8">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 w-80 text-center flex flex-col items-center">
              <div className="bg-green-50 p-6 rounded-full mb-6">
                <IconComponent size={48} className="text-[#1a5f42]" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{step.title}</h3>
              <p className="text-gray-500">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
