import React from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Mainroutes } from './routes/Mainroutes';
import { ProgressProvider } from './context/ProgressContext';

function App() {
  return (
    <ProgressProvider>
      <div className="min-h-screen bg-[#0a0a0a] font-sans text-white selection:bg-[#ccff00] selection:text-black flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Mainroutes />
        </main>
      </div>
    </ProgressProvider>
  );
}

export default App;
