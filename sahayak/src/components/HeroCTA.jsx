import React from 'react';

export const HeroCTA = () => {
  return (
    <div className="flex flex-col items-center w-full pb-16">
      <p className="text-gray-600 font-bold mt-10 mb-4 tracking-wider text-sm">
        #GOVERNMENTSCHEMES / #SCHEMESFORYOU
      </p>
      <button className="bg-[#1a5f42] hover:bg-[#12422e] transition-colors text-white px-8 py-4 rounded-lg text-xl font-bold flex items-center gap-2">
        Find Schemes For You <span>&rarr;</span>
      </button>
    </div>
  );
};
