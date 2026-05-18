import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Bot, User, Loader2, GraduationCap, Bookmark, BookmarkCheck, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAppState } from '../../context/AppStateContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const levelConfig = {
  beginner: { color: 'emerald', label: 'Beginner', emoji: '🌱' },
  intermediate: { color: 'amber', label: 'Intermediate', emoji: '📚' },
  advanced: { color: 'rose', label: 'Advanced', emoji: '🚀' },
};

const LevelBadge = ({ level }) => {
  const cfg = levelConfig[level] || levelConfig.intermediate;
  const colorMap = {
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorMap[cfg.color]}`}>
      <GraduationCap className="w-3 h-3" />
      {cfg.emoji} {cfg.label} Level
    </span>
  );
};

const ChatPanel = () => {
  const {
    chatMessages, setChatMessages, currentVideoId, isIngested,
    addRecommendations, saveNote, savedNotes,
    recordQuery, markHelpful, isMarkedHelpful
  } = useAppState();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Find the user question that precedes a given assistant message
  const getQuestionForMsg = (msgIndex) => {
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (chatMessages[i].role === 'user') return chatMessages[i].content;
    }
    return '';
  };

  const isNoteSaved = (msgId) => {
    return savedNotes.some(n => n.msgId === msgId);
  };

  const handleSaveNote = (msg, msgIndex) => {
    const question = getQuestionForMsg(msgIndex);
    saveNote(msg.id, question, msg.content, msg.level || 'intermediate', currentVideoId);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userQuery = input;
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: userQuery,
      timestamp: 'Just now'
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const startTime = performance.now();

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        videoId: currentVideoId,
        query: userQuery,
      });

      const latencyMs = performance.now() - startTime;
      const { answer, level, recommendations } = response.data;

      const assistantMsgId = Date.now() + 1;

      setChatMessages(prev => [...prev, {
        id: assistantMsgId,
        role: 'assistant',
        content: answer,
        level: level || 'intermediate',
        timestamp: 'Just now'
      }]);

      // Record the query with its latency
      recordQuery(latencyMs);

      // Save recommendations to context for the Discover page
      if (recommendations && recommendations.length > 0) {
        addRecommendations(recommendations, level, currentVideoId, userQuery);
      }

    } catch (error) {
      console.error("Chat API Error:", error);

      const latencyMs = performance.now() - startTime;
      recordQuery(latencyMs);

      const errorMsg = error.response?.data?.message || "I'm sorry, I encountered an error. Please make sure the transcript is ingested first.";
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: errorMsg,
        timestamp: 'Just now'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-6rem)] shadow-xl relative">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">Contextual AI</h3>
            <p className={`text-xs flex items-center gap-1 ${isIngested ? 'text-green-400' : 'text-yellow-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full inline-block animate-pulse ${isIngested ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              {isIngested ? 'Ready to help' : 'Ingest transcript first'}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-900/50">
        {chatMessages.map((msg, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' 
                ? 'bg-slate-700 border border-slate-600' 
                : 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-slate-300" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-sm'
                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'
            }`}>
              {msg.role === 'user' ? (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              ) : (
                <div>
                  {/* Level Badge + Action Buttons Row */}
                  {msg.level && (
                    <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                      <LevelBadge level={msg.level} />
                      <div className="flex items-center gap-1.5">
                        {/* Helpful button */}
                        <button
                          onClick={() => markHelpful(msg.id)}
                          disabled={isMarkedHelpful(msg.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                            isMarkedHelpful(msg.id)
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default'
                              : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:bg-emerald-500/15 hover:text-emerald-400 hover:border-emerald-500/30'
                          }`}
                          title={isMarkedHelpful(msg.id) ? 'Marked as helpful' : 'Mark as helpful'}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          {isMarkedHelpful(msg.id) ? 'Helpful' : 'Helpful?'}
                        </button>
                        {/* Save button */}
                        <button
                          onClick={() => handleSaveNote(msg, index)}
                          disabled={isNoteSaved(msg.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                            isNoteSaved(msg.id)
                              ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30 cursor-default'
                              : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:bg-purple-500/15 hover:text-purple-400 hover:border-purple-500/30'
                          }`}
                          title={isNoteSaved(msg.id) ? 'Saved to Notes' : 'Save to Notes'}
                        >
                          {isNoteSaved(msg.id) ? (
                            <><BookmarkCheck className="w-3 h-3" /> Saved</>
                          ) : (
                            <><Bookmark className="w-3 h-3" /> Save</>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Welcome message — no action buttons */}
                  {!msg.level && <div className="mb-0"></div>}
                  <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-headings:text-slate-100 prose-a:text-blue-400 hover:prose-a:text-blue-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm p-3 flex items-center gap-2 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-sm">Analyzing context & assessing level...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this video..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-2 flex justify-center gap-2">
          <span className="text-[10px] text-slate-500">Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
