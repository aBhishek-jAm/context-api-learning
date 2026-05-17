import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Users, LogOut, Trash2, Search, BookOpen,
  UserCircle, Mail, Calendar, GraduationCap, RefreshCw,
  AlertTriangle, ChevronDown, BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/admin/students', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch students');
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDelete = async (id, name) => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/admin/students/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete student');
      setStudents(prev => prev.filter(s => s._id !== id));
      setDeleteConfirm(null);
      setSuccessMsg(`${name} has been removed successfully`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr));
  };

  const levelConfig = {
    beginner: { emoji: '🌱', classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    intermediate: { emoji: '📚', classes: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    advanced: { emoji: '🚀', classes: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Admin Navbar */}
      <nav className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Shield className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">
              Admin Dashboard
            </h1>
            <p className="text-[10px] text-slate-500 -mt-0.5">ContextLearn AI</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <UserCircle className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-medium text-slate-300">{user?.name || 'Admin'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 hover:border-red-500/50 hover:text-red-400 text-slate-400 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm text-slate-400">Total Students</span>
            </div>
            <p className="text-3xl font-bold text-white">{students.length}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-sm text-slate-400">Learning Levels</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-emerald-400">🌱 {students.filter(s => s.learningLevel === 'beginner').length}</span>
              <span className="text-amber-400">📚 {students.filter(s => s.learningLevel === 'intermediate').length}</span>
              <span className="text-rose-400">🚀 {students.filter(s => s.learningLevel === 'advanced').length}</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-sm text-slate-400">Platform Status</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          </div>
        </div>

        {/* Students Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Registered Students
                </h2>
                <p className="text-sm text-slate-400 mt-1">{filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="admin-search"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search students..."
                    className="bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all w-64"
                  />
                </div>
                <button
                  onClick={fetchStudents}
                  className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-blue-500/50 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mx-6 mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              {successMsg}
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-400">Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No students found</p>
              <p className="text-xs text-slate-500 mt-1">
                {searchTerm ? 'Try a different search term' : 'No students have registered yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Student</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Email</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Level</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Joined</th>
                    <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const lcfg = levelConfig[student.learningLevel] || levelConfig.intermediate;
                    const initials = student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

                    return (
                      <tr key={student._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-blue-400">{initials}</span>
                            </div>
                            <span className="text-sm font-medium text-slate-200">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-400 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            {student.email}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${lcfg.classes}`}>
                            {lcfg.emoji} {student.learningLevel}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-400 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(student.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {deleteConfirm === student._id ? (
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-xs text-red-400">Delete?</span>
                              <button
                                onClick={() => handleDelete(student._id, student.name)}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition-colors"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium rounded-lg transition-colors"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(student._id)}
                              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
