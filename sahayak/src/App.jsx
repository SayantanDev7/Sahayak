import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { useAuth } from './hooks/useAuth';
import { Header } from './components/Header';
import { Auth } from './pages/Auth';
import { UserHub } from './pages/UserHub';
import { ExploreScheme } from './pages/ExploreScheme';
import { SchemeDetails } from './pages/SchemeDetails';

// Simple wrapper to protect routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="text-xl text-center py-10">Kripya Pratiksha Karein...</div>;
  return isAuthenticated ? children : <Navigate to="/" />;
};

function AppRoutes() {
  const [lang, setLang] = useState('en');
  const toggleLang = () => setLang(prev => prev === 'en' ? 'hi' : 'en');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header lang={lang} toggleLang={toggleLang} />
      
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8 md:py-12 space-y-12">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/hub" element={
            <ProtectedRoute>
              <UserHub />
            </ProtectedRoute>
          } />
          <Route path="/explore" element={
            <ProtectedRoute>
              <ExploreScheme />
            </ProtectedRoute>
          } />
          <Route path="/scheme/:id" element={
            <ProtectedRoute>
              <SchemeDetails />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      
      <footer className="text-white text-center p-6 mt-auto border-t-4" style={{ backgroundColor: '#000080', borderColor: '#FF9933' }}>
         <p className="text-lg opacity-80">Sahayak - Made for India</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        
          <AppRoutes />
        
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
