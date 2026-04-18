import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  { subtitle: "FOR STUDENTS", title: "Vidyalaxmi Education Loan" },
  { subtitle: "FOR FARMERS", title: "PM Kisan Samman Nidhi" },
  { subtitle: "HEALTHCARE", title: "Ayushman Bharat Scheme" },
  { subtitle: "ENTREPRENEURS", title: "Mudra Yojana Startup Fund" }
];

export const Categories = () => {
  return (
    <div className="w-full py-24 px-8 max-w-7xl mx-auto font-sans">
      <h3 className="text-[#ccff00] text-sm font-bold tracking-widest mb-4">
        WE ARE GREAT AT
      </h3>
      <h2 className="text-white text-4xl md:text-5xl font-bold mb-16 max-w-3xl leading-tight">
        Scheme Discovery & Smart Document Services
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES.map((cat, index) => (
          <div 
            key={index}
            className="bg-[#141414] border border-white/5 rounded-2xl p-8 group hover:border-[#ccff00]/50 transition-colors cursor-pointer relative overflow-hidden min-h-[200px] flex flex-col justify-between"
          >
            <div>
              <p className="text-gray-400 text-sm font-bold tracking-wider mb-3">
                {cat.subtitle}
              </p>
              <h4 className="text-white text-3xl font-bold max-w-[80%] leading-tight">
                {cat.title}
              </h4>
            </div>
            
            <div className="absolute bottom-8 right-8">
              <ArrowUpRight 
                size={40} 
                className="text-gray-600 group-hover:text-[#ccff00] group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-300" 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
