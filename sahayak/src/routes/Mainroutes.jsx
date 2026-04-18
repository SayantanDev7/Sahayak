import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import all pages
import { Home } from '../pages/Home';
import { Auth } from '../pages/Auth';
import { ExploreScheme } from '../pages/ExploreScheme';
import { UserHub } from '../pages/UserHub';
import { SchemeDetails } from '../pages/SchemeDetails';
import { Contact } from '../pages/Contact';

export const Mainroutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/explore" element={<ExploreScheme />} />
      <Route path="/dashboard" element={<UserHub />} />
      <Route path="/scheme/:id" element={<SchemeDetails />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};
