import React, { createContext, useState, useEffect } from 'react';
import { userProgressData } from '../utils/mockData';

const STORAGE_KEY = 'sahayak_progress';

export const ProgressContext = createContext();

function loadPersistedProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Could not load persisted progress', e);
  }
  // Fallback to mock data on first visit
  return userProgressData.activeApplication;
}

export function ProgressProvider({ children }) {
  const [progressData, setProgressData] = useState(loadPersistedProgress);

  // Persist to localStorage on every change
  useEffect(() => {
    if (progressData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
    }
  }, [progressData]);

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

  const markDocRejected = (reqId, reason) => {
    setProgressData((prev) => {
      if (!prev) return prev;
      const updatedDocs = prev.documents.map((doc) =>
        doc.id === reqId ? { ...doc, status: 'rejected', file: null, rejectionReason: reason } : doc
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

    const newData = {
      schemeId: scheme.id,
      title: scheme.title,
      progress: 0,
      documents: initialDocs
    };

    setProgressData(newData);
  };

  // Find the first pending/rejected document index
  const getFirstIncompleteDocIndex = () => {
    if (!progressData || !progressData.documents) return -1;
    return progressData.documents.findIndex(d => d.status !== 'uploaded');
  };

  return (
    <ProgressContext.Provider value={{
      progressData,
      uploadDocument,
      markDocRejected,
      startApplication,
      getFirstIncompleteDocIndex
    }}>
      {children}
    </ProgressContext.Provider>
  );
}
