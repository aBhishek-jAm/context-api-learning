import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { Clock, PlayCircle, Calendar, Trash2 } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const { watchHistory, setWatchHistory, setCurrentVideoId, setIsIngested, setTranscriptChunks, setChatMessages } = useAppState();
  const navigate = useNavigate();

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const resumeVideo = (videoId) => {
    setCurrentVideoId(videoId);
    setIsIngested(false);
    setTranscriptChunks([]);
    setChatMessages([
      {
        id: Date.now(),
        role: 'assistant',
        content: 'Hello! I am your contextual AI assistant. Ask me anything about the video!',
        timestamp: 'Just now'
      }
    ]);
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      <div className="flex flex-1 max-w-[1600px] w-full mx-auto relative">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto w-full">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                Watch History
              </h1>
              <p className="text-slate-400 mt-2">Resume your recently watched lectures and study sessions.</p>
            </div>

            {watchHistory.length > 0 && (
              <button 
                onClick={() => setWatchHistory([])}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 hover:border-red-500/50 hover:text-red-400 text-slate-300 rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear History
              </button>
            )}
          </div>

          {watchHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-200 mb-2">No watch history yet</h2>
              <p className="text-slate-400 max-w-sm mb-6">Videos you start watching from the "My Courses" section will appear here.</p>
              <button 
                onClick={() => navigate('/courses')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {watchHistory.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-colors group flex flex-col"
                >
                  {/* Thumbnail */}
                  <div 
                    className="h-44 bg-slate-800 relative cursor-pointer overflow-hidden"
                    onClick={() => resumeVideo(item.id)}
                  >
                    <img 
                      src={item.courseImage || `https://img.youtube.com/vi/${item.id}/maxresdefault.jpg`} 
                      alt={item.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop' }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 backdrop-blur">
                        <PlayCircle className="w-6 h-6 ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs font-medium text-slate-200 backdrop-blur">
                      {item.duration || "Video"}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 
                        className="text-lg font-bold text-slate-100 line-clamp-2 cursor-pointer hover:text-blue-400 transition-colors"
                        onClick={() => resumeVideo(item.id)}
                      >
                        {item.title}
                      </h3>
                      <p className="text-sm text-blue-400 mt-1">{item.courseTitle}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 truncate pr-2">
                        <User className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.instructor || "Unknown Instructor"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(item.watchedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default History;
