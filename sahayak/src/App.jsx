import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Categories } from './components/Categories';
import { Process } from './components/Process';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white selection:bg-[#ccff00] selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Categories />
        <Process />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default App;
