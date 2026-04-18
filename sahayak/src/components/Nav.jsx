import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export const Nav = () => {
  return (
    <nav className="fixed w-full top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 px-8 py-5 flex justify-between items-center font-sans transition-all">
      <div className="flex items-center">
        <Link to="/" className="text-white text-2xl font-extrabold tracking-tight hover:text-white/80 transition-colors">
          Sahayak
        </Link>
      </div>

      <div className="hidden md:flex gap-8">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `text-sm font-medium transition-colors ${isActive ? 'text-[#ccff00]' : 'text-gray-300 hover:text-[#ccff00]'}`
          }
        >
          Home
        </NavLink>
        <NavLink 
          to="/explore" 
          className={({ isActive }) => 
            `text-sm font-medium transition-colors ${isActive ? 'text-[#ccff00]' : 'text-gray-300 hover:text-[#ccff00]'}`
          }
        >
          Explore Schemes
        </NavLink>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            `text-sm font-medium transition-colors ${isActive ? 'text-[#ccff00]' : 'text-gray-300 hover:text-[#ccff00]'}`
          }
        >
          My Dashboard
        </NavLink>
      </div>

      <div>
        <button className="bg-[#ccff00] text-black px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform">
          Sign In ↗
        </button>
      </div>
    </nav>
  );
};
