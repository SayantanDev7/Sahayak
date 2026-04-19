import React from 'react';
import { Navbar } from './components/Navbar';
import { Mainroutes } from './routes/Mainroutes';
import { ProgressProvider } from './context/ProgressContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { UserSchemeProvider } from './context/UserSchemeContext';

function App() {
  return (
    <LanguageProvider>
      <UserSchemeProvider>
        <ProgressProvider>
          <AppContent />
        </ProgressProvider>
      </UserSchemeProvider>
    </LanguageProvider>
  );
}

function AppContent() {
  const { t } = useLanguage();
  
  React.useEffect(() => {
    document.title = t.appName;
  }, [t.appName]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white selection:bg-[#ccff00] selection:text-black flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Mainroutes />
      </main>
    </div>
  );
}

export default App;
