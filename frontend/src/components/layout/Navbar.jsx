import React from 'react';
import { BookOpen, User, Settings, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <BookOpen className="text-white w-6 h-6" />
        </div>
        <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          ContextLearn AI
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
        </button>
        <button className="p-2 text-slate-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <Link to="/profile" className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:border-blue-500/50 transition-colors">
          <User className="w-5 h-5 text-slate-300" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
