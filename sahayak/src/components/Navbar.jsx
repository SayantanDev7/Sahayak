import React from 'react';

export const Navbar = () => {
  return (
    <nav className="fixed w-full top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 px-8 py-5 flex justify-between items-center font-sans transition-all">
      <div className="flex items-center">
        <span className="text-white text-2xl font-extrabold tracking-tight">Sahayak</span>
      </div>

      <div className="hidden md:flex gap-8">
        <a href="#" className="text-gray-300 hover:text-[#ccff00] text-sm font-medium transition-colors">Home</a>
        <a href="#" className="text-gray-300 hover:text-[#ccff00] text-sm font-medium transition-colors">Schemes</a>
        <a href="#" className="text-gray-300 hover:text-[#ccff00] text-sm font-medium transition-colors">How it Works</a>
      </div>

      <div>
        <button className="bg-[#ccff00] text-black px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform">
          Sign In ↗
        </button>
      </div>
    </nav>
  );
};
