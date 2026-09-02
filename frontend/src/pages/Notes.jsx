import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { Bookmark, Trash2, GraduationCap, MessageSquare, Video, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const levelConfig = {
  beginner: { label: 'Beginner', emoji: '🌱' },
  intermediate: { label: 'Intermediate', emoji: '📚' },
  advanced: { label: 'Advanced', emoji: '🚀' },
};

const levelBadgeClasses = {
  beginner: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  intermediate: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  advanced: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

const NoteCard = ({ note, onRemove }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = levelConfig[note.level] || levelConfig.intermediate;

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  // Truncate the answer for collapsed view
  const previewLength = 250;
  const isLongAnswer = note.answer.length > previewLength;
  const previewText = isLongAnswer ? note.answer.substring(0, previewLength) + '...' : note.answer;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-200 group">
      {/* Note header */}
      <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-800/30">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Meta row: level badge + video info */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${levelBadgeClasses[note.level]}`}>
                <GraduationCap className="w-3 h-3" />
                {cfg.emoji} {cfg.label}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
                <Video className="w-3 h-3 text-blue-400" />
                {note.videoTitle}
              </span>
              <span className="text-[11px] text-slate-500">{note.courseTitle}</span>
            </div>

            {/* Question */}
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-slate-200 leading-relaxed">"{note.question}"</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onRemove(note.id)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Remove from saved notes"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mt-2 text-[11px] text-slate-500">{formatDate(note.savedAt)}</div>
      </div>

      {/* Answer body */}
      <div className="px-6 py-5">
        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700 prose-headings:text-slate-100 prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-li:text-slate-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {expanded || !isLongAnswer ? note.answer : previewText}
          </ReactMarkdown>
        </div>

        {isLongAnswer && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            {expanded ? (
              <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> Show full response</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const Notes = () => {
  const { savedNotes, removeNote, setSavedNotes } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = searchQuery.trim()
    ? savedNotes.filter(n =>
        n.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.videoTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : savedNotes;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      <div className="flex flex-1 max-w-[1600px] w-full mx-auto relative">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto w-full">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <Bookmark className="w-6 h-6 text-purple-400" />
                </div>
                Saved Notes
              </h1>
              <p className="text-slate-400 mt-2">Your bookmarked AI responses for quick reference.</p>
            </div>

            {savedNotes.length > 0 && (
              <button
                onClick={() => setSavedNotes([])}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 hover:border-red-500/50 hover:text-red-400 text-slate-300 rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Search bar */}
          {savedNotes.length > 0 && (
            <div className="relative mb-6">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your saved notes..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Stats bar */}
          {savedNotes.length > 0 && (
            <div className="flex items-center gap-4 mb-6 text-sm text-slate-400">
              <span>{savedNotes.length} note{savedNotes.length !== 1 ? 's' : ''} saved</span>
              {searchQuery && <span className="text-slate-500">· {filtered.length} result{filtered.length !== 1 ? 's' : ''} found</span>}
            </div>
          )}

          {/* Content */}
          {savedNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                <Bookmark className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-200 mb-2">No saved notes yet</h2>
              <p className="text-slate-400 max-w-sm mb-2">When the AI answers your questions, click the <strong className="text-purple-400">Save</strong> button to bookmark responses here.</p>
              <p className="text-slate-500 text-sm max-w-sm">Saved notes include the question, AI answer, level assessment, and which video it was from.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[40vh] text-center">
              <Search className="w-10 h-10 text-slate-600 mb-3" />
              <h2 className="text-lg font-bold text-slate-300 mb-1">No matching notes</h2>
              <p className="text-slate-500 text-sm">Try a different search term.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {filtered.map(note => (
                <NoteCard key={note.id} note={note} onRemove={removeNote} />
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Notes;
