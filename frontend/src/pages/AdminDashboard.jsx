import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Shield, LogOut, UserCircle, LayoutDashboard, Users, BarChart3, Menu, X
} from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import OverviewSection from '../components/admin/OverviewSection';
import StudentsSection from '../components/admin/StudentsSection';
import AnalyticsSection from '../components/admin/AnalyticsSection';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data state
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/admin/students`, {
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch students');
      setStudents(data);
    } catch (err) {
      setError(err.message);
    }
  }, [user.token]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/admin/analytics`, {
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch analytics');
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    }
  }, [user.token]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    await Promise.all([fetchStudents(), fetchAnalytics()]);
    setLoading(false);
  }, [fetchStudents, fetchAnalytics]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDelete = async (id, name) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/admin/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      setStudents(prev => prev.filter(s => s._id !== id));
      // Refresh analytics after delete
      fetchAnalytics();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateLevel = async (id, learningLevel) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/admin/students/${id}/level`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ learningLevel }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      setStudents(prev => prev.map(s => s._id === id ? { ...s, learningLevel } : s));
      fetchAnalytics();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBulkDelete = async (ids) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/admin/students/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      setStudents(prev => prev.filter(s => !ids.includes(s._id)));
      fetchAnalytics();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  const mobileNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const sectionTitles = { overview: 'Dashboard Overview', students: 'Student Management', analytics: 'Analytics & Insights' };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Desktop Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <nav className="h-14 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1.5 text-slate-400 hover:text-white">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-sm font-semibold text-slate-200">{sectionTitles[activeSection]}</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
              <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <UserCircle className="w-4 h-4 text-amber-400" />
              </div>
              <span className="font-medium text-slate-300 text-xs">{user?.name || 'Admin'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 hover:border-red-500/50 hover:text-red-400 text-slate-400 rounded-lg text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </nav>

        {/* Mobile Nav Tabs */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-4 py-3 flex gap-2">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200 bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" /> {error}
            <button onClick={() => setError('')} className="ml-auto text-red-400/60 hover:text-red-400"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {loading && !analytics ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-slate-700 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-slate-400">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {activeSection === 'overview' && <OverviewSection analytics={analytics} students={students} />}
              {activeSection === 'students' && (
                <StudentsSection
                  students={students}
                  loading={loading}
                  onRefresh={fetchAll}
                  onDelete={handleDelete}
                  onUpdateLevel={handleUpdateLevel}
                  onBulkDelete={handleBulkDelete}
                  token={user.token}
                />
              )}
              {activeSection === 'analytics' && <AnalyticsSection analytics={analytics} students={students} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
