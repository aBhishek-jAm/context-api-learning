import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { Star } from 'lucide-react';

const Notes = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      <div className="flex flex-1 max-w-[1600px] w-full mx-auto relative">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto w-full">
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Saved Notes</h2>
            <p className="text-slate-400 max-w-md">Your bookmarked explanations and AI-generated notes will appear here. Coming soon!</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notes;
