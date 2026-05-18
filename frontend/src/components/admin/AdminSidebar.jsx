import React from 'react';
import { Shield, LayoutDashboard, Users, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const AdminSidebar = ({ activeSection, setActiveSection, collapsed, setCollapsed }) => {
  return (
    <aside className={`${collapsed ? 'w-[68px]' : 'w-56'} shrink-0 border-r border-slate-800 bg-slate-900/60 backdrop-blur-md transition-all duration-300 hidden md:flex flex-col`}>
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
          <Shield className="text-white w-5 h-5" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400 whitespace-nowrap">Admin Panel</h1>
            <p className="text-[10px] text-slate-500 -mt-0.5">ContextLearn AI</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
              title={collapsed ? item.label : ''}
            >
              <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-amber-400' : ''}`} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-slate-800">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
