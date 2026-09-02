import React, { createContext, useContext, useState } from 'react';

const AppStateContext = createContext();

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

export const AppStateProvider = ({ children }) => {
  // Chat state — persists across route changes
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I am your contextual AI assistant. Ask me anything about the video!',
      timestamp: 'Just now'
    }
  ]);

  // Transcript state — persists across route changes
  const [transcriptChunks, setTranscriptChunks] = useState([]);
  const [isIngested, setIsIngested] = useState(false);

  // Current video ID
  const [currentVideoId, setCurrentVideoId] = useState('9wqvDPfjGvo');

  // Watch History state
  const [watchHistory, setWatchHistory] = useState([]);

  const addToHistory = (videoDetails) => {
    setWatchHistory(prev => {
      // Remove the video if it already exists to put it at the top
      const filtered = prev.filter(v => v.id !== videoDetails.id);
      return [{ ...videoDetails, watchedAt: new Date().toISOString() }, ...filtered];
    });
  };

  const value = {
    chatMessages,
    setChatMessages,
    transcriptChunks,
    setTranscriptChunks,
    isIngested,
    setIsIngested,
    currentVideoId,
    setCurrentVideoId,
    watchHistory,
    addToHistory,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};
