import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { Compass, ExternalLink, GraduationCap, Trash2, Video, Globe, Filter, MessageSquare, Sparkles } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const levelConfig = {
  beginner: { color: 'emerald', label: 'Beginner', emoji: '🌱', gradient: 'from-emerald-600 to-teal-600' },
  intermediate: { color: 'amber', label: 'Intermediate', emoji: '📚', gradient: 'from-amber-600 to-orange-600' },
  advanced: { color: 'rose', label: 'Advanced', emoji: '🚀', gradient: 'from-rose-600 to-pink-600' },
};

const levelBadgeClasses = {
  beginner: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  intermediate: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  advanced: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

const typeBadgeClasses = {
  nptel: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  free: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
};

const Discover = () => {
  const { recommendations, setRecommendations } = useAppState();
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'All', icon: Sparkles },
    { key: 'beginner', label: 'Beginner', emoji: '🌱' },
    { key: 'intermediate', label: 'Intermediate', emoji: '📚' },
    { key: 'advanced', label: 'Advanced', emoji: '🚀' },
  ];

  const filtered = activeFilter === 'all'
    ? recommendations
    : recommendations.filter(r => r.level === activeFilter);

  // Group by question for organized display
  const grouped = filtered.reduce((acc, rec) => {
    const key = `${rec.videoId}||${rec.question}`;
    if (!acc[key]) {
      acc[key] = { videoId: rec.videoId, question: rec.question, level: rec.level, addedAt: rec.addedAt, items: [] };
    }
    acc[key].items.push(rec);
    return acc;
  }, {});
  const groups = Object.values(grouped);

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

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      <div className="flex flex-1 max-w-[1600px] w-full mx-auto relative">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto w-full">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                  <Compass className="w-6 h-6 text-indigo-400" />
                </div>
                Discover
              </h1>
              <p className="text-slate-400 mt-2">Personalized recommendations based on your questions to the AI assistant.</p>
            </div>

            {recommendations.length > 0 && (
              <button 
                onClick={() => setRecommendations([])}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 hover:border-red-500/50 hover:text-red-400 text-slate-300 rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          {recommendations.length > 0 && (
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              {filters.map(f => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap border ${
                    activeFilter === f.key
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                  }`}
                >
                  {f.icon ? <f.icon className="w-4 h-4" /> : <span>{f.emoji}</span>}
                  {f.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeFilter === f.key ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {f.key === 'all' ? recommendations.length : recommendations.filter(r => r.level === f.key).length}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          {recommendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                <Compass className="w-8 h-8 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-200 mb-2">No recommendations yet</h2>
              <p className="text-slate-400 max-w-sm mb-2">Start a conversation with the AI assistant while watching a video.</p>
              <p className="text-slate-500 text-sm max-w-sm">The AI will assess your level and recommend relevant NPTEL courses and free resources tailored to you.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[40vh] text-center">
              <Filter className="w-10 h-10 text-slate-600 mb-3" />
              <h2 className="text-lg font-bold text-slate-300 mb-1">No {activeFilter} recommendations</h2>
              <p className="text-slate-500 text-sm">Try a different filter or ask more questions.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {groups.map((group, gi) => {
                const cfg = levelConfig[group.level] || levelConfig.intermediate;
                return (
                  <div key={gi} className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
                    {/* Group header */}
                    <div className={`px-6 py-4 bg-gradient-to-r ${cfg.gradient} bg-opacity-10 border-b border-slate-800`}
                      style={{ background: `linear-gradient(135deg, rgba(30,41,59,0.95), rgba(30,41,59,0.8))` }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${levelBadgeClasses[group.level]}`}>
                              <GraduationCap className="w-3 h-3" />
                              {cfg.emoji} {cfg.label}
                            </span>
                          </div>
                          <div className="flex items-start gap-2 text-slate-300">
                            <MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
                            <p className="text-sm leading-relaxed line-clamp-2">"{group.question}"</p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">{formatDate(group.addedAt)}</span>
                      </div>
                    </div>

                    {/* Recommendation cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
                      {group.items.map((rec) => (
                        <a
                          key={rec.id}
                          href={rec.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 hover:bg-slate-800 transition-all duration-200 hover:shadow-lg hover:shadow-black/20"
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                rec.type === 'nptel' 
                                  ? 'bg-blue-500/15 border border-blue-500/30' 
                                  : 'bg-purple-500/15 border border-purple-500/30'
                              }`}>
                                {rec.type === 'nptel' 
                                  ? <Video className="w-4 h-4 text-blue-400" /> 
                                  : <Globe className="w-4 h-4 text-purple-400" />
                                }
                              </div>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${typeBadgeClasses[rec.type]}`}>
                                {rec.type === 'nptel' ? 'NPTEL / Video' : 'Free Resource'}
                              </span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors shrink-0" />
                          </div>

                          <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors line-clamp-2 mb-2">
                            {rec.title}
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                            {rec.description}
                          </p>

                          <div className="mt-3 pt-3 border-t border-slate-700/50">
                            <p className="text-[11px] text-slate-500 truncate">{rec.url}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Discover;
