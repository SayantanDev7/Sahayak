import React, { createContext, useState, useEffect } from 'react';
import { userProgressData } from '../utils/mockData';

export const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progressData, setProgressData] = useState(userProgressData.activeApplication);

  const uploadDocument = (reqId, fileInfo) => {
    setProgressData((prev) => {
      if (!prev) return prev;
      const updatedDocs = prev.documents.map((doc) => 
        doc.id === reqId ? { ...doc, status: 'uploaded', file: fileInfo.name } : doc
      );
      
      const completed = updatedDocs.filter((d) => d.status === 'uploaded').length;
      const total = updatedDocs.length;
      const newProgress = Math.round((completed / total) * 100);

      return {
        ...prev,
        progress: newProgress,
        documents: updatedDocs
      };
    });
  };

  const startApplication = (scheme) => {
    const initialDocs = scheme.requirements.map(req => ({
      id: req.id,
      status: 'pending',
      file: null
    }));

    setProgressData({
      schemeId: scheme.id,
      title: scheme.title,
      progress: 0,
      documents: initialDocs
    });
  };

  return (
    <ProgressContext.Provider value={{ progressData, uploadDocument, startApplication }}>
      {children}
    </ProgressContext.Provider>
  );
}
