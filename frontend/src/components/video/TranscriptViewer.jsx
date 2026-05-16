import React, { useState } from 'react';
import { AlignLeft, Database, Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useAppState } from '../../context/AppStateContext';

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const TranscriptViewer = () => {
  const { transcriptChunks, setTranscriptChunks, isIngested, setIsIngested, currentVideoId } = useAppState();
  const [ingesting, setIngesting] = useState(false);

  const handleIngest = async () => {
    setIngesting(true);
    try {
      // Step 1: Ingest transcript
      await axios.post('http://localhost:5000/api/transcripts/ingest', { videoId: currentVideoId });
      
      // Step 2: Fetch the saved transcript to display
      const res = await axios.get(`http://localhost:5000/api/transcripts/${currentVideoId}`);
      if (res.data && res.data.chunks) {
        setTranscriptChunks(res.data.chunks);
      }

      setIsIngested(true);
    } catch (error) {
      console.error("Ingestion error:", error);
      alert(error.response?.data?.message || "Failed to ingest transcript. Check backend logs.");
    } finally {
      setIngesting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[300px]">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
        <div className="flex items-center gap-2 text-slate-200 font-medium">
          <AlignLeft className="w-4 h-4 text-blue-400" />
          <span>Transcript</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleIngest}
            disabled={ingesting || isIngested}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isIngested 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {ingesting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isIngested ? (
              <CheckCircle className="w-3.5 h-3.5" />
            ) : (
              <Database className="w-3.5 h-3.5" />
            )}
            {ingesting ? 'Fetching transcript...' : isIngested ? `Ready (${transcriptChunks.length} chunks)` : 'Ingest to AI'}
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto p-4 flex-1 space-y-3 custom-scrollbar">
        {transcriptChunks.length > 0 ? (
          transcriptChunks.map((chunk, idx) => (
            <div 
              key={idx} 
              className="flex gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:bg-slate-800/50 border border-transparent"
            >
              <span className="text-xs font-mono mt-0.5 text-blue-400 shrink-0">
                {formatTime(chunk.start)}
              </span>
              <p className="text-sm leading-relaxed text-slate-300">
                {chunk.text}
              </p>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            Click "Ingest to AI" to fetch the video transcript
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptViewer;
