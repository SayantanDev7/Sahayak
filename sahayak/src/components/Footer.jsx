import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 pt-20 pb-10 px-8 w-full flex flex-col items-center text-center overflow-hidden font-sans">
      
      {/* Links Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 w-full mb-16 text-left">
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">{t.footer.product}</h4>
          <ul className="flex flex-col gap-3">
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">{t.footer.features}</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">{t.footer.integrations}</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">{t.footer.pricing}</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">{t.footer.changelog}</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">{t.footer.company}</h4>
          <ul className="flex flex-col gap-3">
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">{t.footer.aboutUs}</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">{t.footer.careers}</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">{t.footer.blog}</li>
            <li><Link to="/contact" className="text-gray-400 hover:text-white cursor-pointer transition-colors">{t.footer.contact}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">{t.footer.resources}</h4>
          <ul className="flex flex-col gap-3">
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">{t.footer.community}</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">{t.footer.helpCenter}</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">{t.footer.documentation}</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">{t.footer.partners}</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">{t.footer.legal}</h4>
          <ul className="flex flex-col gap-3">
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">{t.footer.privacy}</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">{t.footer.terms}</li>
            <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">{t.footer.cookie}</li>
          </ul>
        </div>
      </div>

      {/* The Massive Logo Text */}
      <div className="w-full mt-8 flex justify-center">
        <h1 className="text-[13vw] font-black text-white leading-none tracking-tighter hover:text-[#ccff00] transition-colors duration-500 cursor-default uppercase">
          {t.appName}
        </h1>
      </div>

      <div className="text-gray-600 text-sm mt-8 font-medium">
        &copy; {new Date().getFullYear()} {t.footer.rights}
      </div>
    </footer>
  );
};
