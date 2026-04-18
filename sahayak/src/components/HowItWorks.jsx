import React from 'react';
import { FileText, Search, CheckCircle } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    { icon: FileText, title: "Enter Details", desc: "Start by entering your basic details to find schemes." },
    { icon: Search, title: "Search", desc: "Our engine will filter out the best schemes for you." },
    { icon: CheckCircle, title: "Select & Apply", desc: "Choose your scheme and easily apply online." }
  ];

  return (
    <div className="bg-[#f8fafc] py-20 flex flex-col items-center px-4 font-sans w-full">
      <h2 className="text-4xl font-extrabold text-black mb-16 text-center">
        Easy steps to apply for Government Schemes
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
    </div>
  );
};
