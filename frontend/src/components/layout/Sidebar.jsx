import React from 'react';
import { Home, Compass, Library, Clock, Star, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Compass, label: 'Discover', path: '/discover' },
  { icon: Library, label: 'My Courses', path: '/courses' },
  { icon: Clock, label: 'History', path: '/history' },
  { icon: Star, label: 'Saved Notes', path: '/notes' },
  { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 hidden lg:flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 flex-1">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 font-medium' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800">
        <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-indigo-500/20 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-slate-200 mb-1">Upgrade to Pro</h4>
          <p className="text-xs text-slate-400 mb-3">Get advanced AI models and unlimited queries.</p>
          <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
