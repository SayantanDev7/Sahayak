import React from 'react';
import PropTypes from 'prop-types';
import { Globe } from 'lucide-react';
import { Button } from './ui/Button';

export function Header({ lang, toggleLang }) {
  return (
    <header
      className="text-white shadow-md sticky top-0 z-50"
      style={{ backgroundColor: "#000080" }} // navy fix
    >
      <div className="max-w-5xl mx-auto px-8 h-24 flex items-center justify-between">
        <div className="flex items-center gap-4">
          
          {/* Logo */}
          <div className="flex bg-white rounded-lg overflow-hidden border-2 border-white">
            <div className="w-4 h-10" style={{ backgroundColor: "#FF9933" }}></div>
            
            <div className="w-4 h-10 bg-white shadow-inner relative flex justify-center items-center">
              <div
                className="w-2 h-2 rounded-full"
                style={{ border: "1px solid #000080" }}
              ></div>
            </div>
            
            <div className="w-4 h-10" style={{ backgroundColor: "#138808" }}></div>
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-baseline gap-2">
              Sahayak
              <span className="text-sm font-normal text-blue-200 border border-blue-400 px-2 rounded-full uppercase tracking-widest hidden sm:inline-block">
                Beta
              </span>
            </h1>

            <p className="text-blue-200 text-lg sm:block hidden">
              {lang === 'en'
                ? 'E-Government Portal for Citizens'
                : 'नागरिकों के लिए ई-गवर्नेंस पोर्टल'}
            </p>
          </div>
        </div>

        <div>
          <Button
            variant="outline"
            size="md"
            className="text-white border-white hover:bg-blue-800 focus:ring-white flex items-center gap-2"
            onClick={toggleLang}
            aria-label={`Switch language to ${lang === 'en' ? 'Hindi' : 'English'}`}
          >
            <Globe className="w-5 h-5" />
            <span className="font-bold">
              {lang === 'en' ? 'हिन्दी' : 'English'}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  lang: PropTypes.string.isRequired,
  toggleLang: PropTypes.func.isRequired,
};