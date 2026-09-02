import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { TrendingUp } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      <div className="flex flex-1 max-w-[1600px] w-full mx-auto relative">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto w-full">
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Analytics</h2>
            <p className="text-slate-400 max-w-md">Detailed learning analytics and progress tracking will appear here. Coming soon!</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
