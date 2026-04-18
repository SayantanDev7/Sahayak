import React from 'react';

export const Stats = () => {
  const stats = [
    { number: "4630+", label: "Total Schemes ->" },
    { number: "630+", label: "Central Schemes ->" },
    { number: "4000+", label: "States/UTs Schemes ->" }
  ];

  return (
    <div className="w-full px-4 font-sans">
      <div className="max-w-5xl mx-auto py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#e6f7ed] rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-4xl font-extrabold text-black mb-2">{stat.number}</h2>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
