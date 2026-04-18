import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  return (
    <nav className="fixed w-full top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 px-8 py-5 flex justify-between items-center font-sans transition-all">
      <div className="flex items-center">
        <Link to="/" className="text-white text-2xl font-extrabold tracking-tight hover:text-white/80 transition-colors">
          {t.appName}
        </Link>
      </div>

      <div className="hidden md:flex gap-8">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `text-sm font-medium transition-colors ${isActive ? 'text-[#ccff00]' : 'text-gray-300 hover:text-[#ccff00]'}`
          }
        >
          {t.nav.home}
        </NavLink>
        <NavLink 
          to="/explore" 
          className={({ isActive }) => 
            `text-sm font-medium transition-colors ${isActive ? 'text-[#ccff00]' : 'text-gray-300 hover:text-[#ccff00]'}`
          }
        >
          {t.nav.explore}
        </NavLink>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            `text-sm font-medium transition-colors ${isActive ? 'text-[#ccff00]' : 'text-gray-300 hover:text-[#ccff00]'}`
          }
        >
          {t.nav.dashboard}
        </NavLink>
        <NavLink 
          to="/contact" 
          className={({ isActive }) => 
            `text-sm font-medium transition-colors ${isActive ? 'text-[#ccff00]' : 'text-gray-300 hover:text-[#ccff00]'}`
          }
        >
          {t.nav.contact}
        </NavLink>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleLanguage}
          className="border border-white/20 text-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors font-bold flex items-center gap-2"
        >
          <span>A/अ</span>
          <span className="hidden md:inline">
            {language === 'en' ? 'Hindi' : 'English'}
          </span>
        </button>
        <Link to="/auth" className="inline-block bg-[#ccff00] text-black px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform">
          {t.nav.signin}
        </Link>
      </div>
    </nav>
  );
};
