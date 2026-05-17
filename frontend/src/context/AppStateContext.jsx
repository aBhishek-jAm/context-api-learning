import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { getVideoDetails } from '../data/courses';
import { useAuth } from './AuthContext';

const AppStateContext = createContext();

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

export const AppStateProvider = ({ children }) => {
  const { user: authUser } = useAuth();

  // User profile state — seeded from auth user when available
  const [userProfile, setUserProfile] = useState({
    name: 'Student',
    email: 'student@example.com',
    role: 'student',
    learningLevel: 'intermediate',
    institution: '',
    bio: '',
    joinedAt: new Date().toISOString(),
  });

  // Sync profile when auth user changes (login/logout)
  useEffect(() => {
    if (authUser && authUser.role === 'student') {
      setUserProfile(prev => ({
        ...prev,
        name: authUser.name || prev.name,
        email: authUser.email || prev.email,
        role: authUser.role || 'student',
        learningLevel: authUser.learningLevel || prev.learningLevel,
      }));
    }
  }, [authUser]);

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
  const [currentVideoId, setCurrentVideoIdRaw] = useState('9wqvDPfjGvo');
  const previousVideoIdRef = useRef('9wqvDPfjGvo');

  // Watch History state
  const [watchHistory, setWatchHistory] = useState([]);

  // Recommendations state — accumulated from chat responses
  const [recommendations, setRecommendations] = useState([]);

  const addRecommendations = useCallback((newRecs, level, videoId, questionText) => {
    if (!newRecs || newRecs.length === 0) return;
    const enriched = newRecs.map((rec, i) => ({
      ...rec,
      id: `${Date.now()}-${i}`,
      level,
      videoId,
      question: questionText,
      addedAt: new Date().toISOString(),
    }));
    setRecommendations(prev => [...enriched, ...prev]);
  }, []);

  // Saved Notes state — bookmarked AI responses
  const [savedNotes, setSavedNotes] = useState([]);

  const saveNote = useCallback((msgId, question, answer, level, videoId) => {
    setSavedNotes(prev => {
      // Don't save duplicates
      if (prev.some(n => n.msgId === msgId)) return prev;
      const videoDetails = getVideoDetails(videoId);
      return [{
        id: `note-${Date.now()}`,
        msgId,
        question,
        answer,
        level,
        videoId,
        videoTitle: videoDetails?.title || 'Unknown Video',
        courseTitle: videoDetails?.courseTitle || 'Unknown Course',
        savedAt: new Date().toISOString(),
      }, ...prev];
    });
  }, []);

  const removeNote = useCallback((noteId) => {
    setSavedNotes(prev => prev.filter(n => n.id !== noteId));
  }, []);

  // Analytics state
  const [totalQueries, setTotalQueries] = useState(0);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [latencies, setLatencies] = useState([]);
  const [helpfulMsgIds, setHelpfulMsgIds] = useState(new Set());

  const recordQuery = useCallback((latencyMs) => {
    setTotalQueries(prev => prev + 1);
    setLatencies(prev => [...prev, latencyMs]);
  }, []);

  const markHelpful = useCallback((msgId) => {
    setHelpfulMsgIds(prev => {
      if (prev.has(msgId)) return prev;
      const next = new Set(prev);
      next.add(msgId);
      return next;
    });
    setHelpfulCount(prev => prev + 1);
  }, []);

  const isMarkedHelpful = useCallback((msgId) => {
    return helpfulMsgIds.has(msgId);
  }, [helpfulMsgIds]);

  const addToHistory = useCallback((videoDetails) => {
    setWatchHistory(prev => {
      // Remove the video if it already exists to put it at the top
      const filtered = prev.filter(v => v.id !== videoDetails.id);
      return [{ ...videoDetails, watchedAt: new Date().toISOString() }, ...filtered];
    });
  }, []);

  // Wrapper that records the previous video in history whenever the video changes
  const setCurrentVideoId = useCallback((newVideoId) => {
    const prevId = previousVideoIdRef.current;
    if (prevId && prevId !== newVideoId) {
      const details = getVideoDetails(prevId);
      if (details) {
        addToHistory(details);
      }
    }
    previousVideoIdRef.current = newVideoId;
    setCurrentVideoIdRaw(newVideoId);
  }, [addToHistory]);

  const value = {
    userProfile,
    setUserProfile,
    chatMessages,
    setChatMessages,
    transcriptChunks,
    setTranscriptChunks,
    isIngested,
    setIsIngested,
    currentVideoId,
    setCurrentVideoId,
    watchHistory,
    setWatchHistory,
    addToHistory,
    recommendations,
    setRecommendations,
    addRecommendations,
    savedNotes,
    setSavedNotes,
    saveNote,
    removeNote,
    totalQueries,
    helpfulCount,
    latencies,
    recordQuery,
    markHelpful,
    isMarkedHelpful,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};
