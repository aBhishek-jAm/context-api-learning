import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import VideoPlayer from '../components/video/VideoPlayer';
import TranscriptViewer from '../components/video/TranscriptViewer';
import ChatPanel from '../components/chat/ChatPanel';
import AnalyticsWidget from '../components/analytics/AnalyticsWidget';
import { motion } from 'framer-motion';
import { useAppState } from '../context/AppStateContext';

const Dashboard = () => {
  const { currentVideoId } = useAppState();
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="flex flex-1 max-w-[1600px] w-full mx-auto relative">
        <Sidebar />
        
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-100 mb-2">Introduction to Machine Learning</h1>
              <p className="text-sm text-slate-400">Google Cloud Tech</p>
            </div>

            <AnalyticsWidget />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column: Video and Transcript */}
              <div className="xl:col-span-2 space-y-6">
                <VideoPlayer videoId={currentVideoId} />
                <TranscriptViewer />
              </div>

              {/* Right Column: AI Assistant */}
              <div className="xl:col-span-1 h-full">
                <div className="sticky top-24">
                  <ChatPanel />
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
