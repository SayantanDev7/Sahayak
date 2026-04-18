import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 pt-20 pb-10 px-8 w-full flex flex-col items-center text-center overflow-hidden font-sans">
      
      {/* Links Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 w-full mb-16 text-left">
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Product</h4>
          <ul className="flex flex-col gap-3">
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Features</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Integrations</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Pricing</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Changelog</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Company</h4>
          <ul className="flex flex-col gap-3">
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">About Us</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Careers</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Blog</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Resources</h4>
          <ul className="flex flex-col gap-3">
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Community</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Help Center</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Documentation</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Partners</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Legal</h4>
          <ul className="flex flex-col gap-3">
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Terms of Service</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Cookie Policy</li>
          </ul>
        </div>
      </div>

      {/* The Massive Logo Text */}
      <div className="w-full mt-8 flex justify-center">
        <h1 className="text-[15vw] font-black text-white leading-none tracking-tighter hover:text-[#ccff00] transition-colors duration-500 cursor-default uppercase">
          SAHAYAK
        </h1>
      </div>

      <div className="text-gray-600 text-sm mt-8 font-medium">
        &copy; {new Date().getFullYear()} Sahayak. All rights reserved.
      </div>
    </footer>
  );
};
