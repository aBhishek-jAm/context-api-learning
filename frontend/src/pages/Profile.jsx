import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { User, Mail, GraduationCap, Building, BookOpen, Calendar, Edit3, Check, X, Shield, TrendingUp, Clock, Bookmark, Compass } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const levelConfig = {
  beginner: { label: 'Beginner', emoji: '🌱', color: 'emerald', classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  intermediate: { label: 'Intermediate', emoji: '📚', color: 'amber', classes: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  advanced: { label: 'Advanced', emoji: '🚀', color: 'rose', classes: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
};

const Profile = () => {
  const { userProfile, setUserProfile, watchHistory, savedNotes, recommendations } = useAppState();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...userProfile });

  const handleEdit = () => {
    setEditForm({ ...userProfile });
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserProfile({ ...editForm });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({ ...userProfile });
    setIsEditing(false);
  };

  const formatDate = (isoString) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(isoString));
  };

  const cfg = levelConfig[userProfile.learningLevel] || levelConfig.intermediate;

  // Compute stats
  const stats = [
    { icon: Clock, label: 'Videos Watched', value: watchHistory.length, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { icon: Bookmark, label: 'Saved Notes', value: savedNotes.length, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { icon: Compass, label: 'Recommendations', value: recommendations.length, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { icon: TrendingUp, label: 'Learning Level', value: cfg.emoji + ' ' + cfg.label, color: `text-${cfg.color}-400`, bg: `bg-${cfg.color}-500/10 border-${cfg.color}-500/20` },
  ];

  // Generate initials for avatar
  const initials = userProfile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      <div className="flex flex-1 max-w-[1600px] w-full mx-auto relative">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto w-full">

          {/* Profile Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6">
            {/* Banner */}
            <div className="h-36 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMzBMMzAgMCA2MCAzMCAzMCA2MHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2cpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-50"></div>
            </div>

            {/* Profile info */}
            <div className="px-6 pb-6 -mt-14 relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-slate-900 flex items-center justify-center shadow-xl shadow-blue-500/20">
                  <span className="text-2xl font-bold text-white">{initials}</span>
                </div>

                <div className="flex-1 pt-2 sm:pt-0 sm:pb-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-slate-100">{userProfile.name}</h1>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.classes}`}>
                      <GraduationCap className="w-3 h-3" />
                      {cfg.emoji} {cfg.label}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
                      <Shield className="w-3 h-3" />
                      {userProfile.role}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">{userProfile.bio}</p>
                </div>

                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 hover:border-blue-500/50 hover:text-blue-400 text-slate-300 rounded-lg text-sm font-medium transition-colors shrink-0"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => (
              <div key={i} className={`rounded-xl border p-4 ${stat.bg}`}>
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                </div>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Details / Edit Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  Personal Information
                </h2>
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                    />
                  ) : (
                    <p className="text-sm text-slate-200 bg-slate-800/50 rounded-lg px-4 py-2.5 border border-slate-800">{userProfile.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                    />
                  ) : (
                    <p className="text-sm text-slate-200 bg-slate-800/50 rounded-lg px-4 py-2.5 border border-slate-800">{userProfile.email}</p>
                  )}
                </div>

                {/* Institution */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    <Building className="w-3.5 h-3.5" /> Institution
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.institution}
                      onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                    />
                  ) : (
                    <p className="text-sm text-slate-200 bg-slate-800/50 rounded-lg px-4 py-2.5 border border-slate-800">{userProfile.institution}</p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    <BookOpen className="w-3.5 h-3.5" /> Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={3}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-none"
                    />
                  ) : (
                    <p className="text-sm text-slate-200 bg-slate-800/50 rounded-lg px-4 py-2.5 border border-slate-800">{userProfile.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account & Preferences */}
            <div className="space-y-6">
              {/* Account Details */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-6">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Account Details
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-800">
                    <span className="text-sm text-slate-400">Role</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 capitalize">
                      {userProfile.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-800">
                    <span className="text-sm text-slate-400">Learning Level</span>
                    {isEditing ? (
                      <select
                        value={editForm.learningLevel}
                        onChange={(e) => setEditForm({ ...editForm, learningLevel: e.target.value })}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option value="beginner">🌱 Beginner</option>
                        <option value="intermediate">📚 Intermediate</option>
                        <option value="advanced">🚀 Advanced</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.classes}`}>
                        {cfg.emoji} {cfg.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-800">
                    <span className="text-sm text-slate-400">Member Since</span>
                    <span className="flex items-center gap-1.5 text-sm text-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {formatDate(userProfile.joinedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-slate-400">Account Status</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Learning Activity Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Learning Activity
                </h2>

                <div className="space-y-4">
                  {watchHistory.length > 0 ? (
                    <>
                      <p className="text-sm text-slate-400">Recently watched:</p>
                      <div className="space-y-2">
                        {watchHistory.slice(0, 3).map((v) => (
                          <div key={v.id} className="flex items-center gap-3 px-3 py-2.5 bg-slate-800/50 rounded-lg border border-slate-800">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                              <Clock className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm text-slate-200 truncate">{v.title}</p>
                              <p className="text-[11px] text-slate-500">{v.courseTitle}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6 text-slate-500">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No watch history yet</p>
                      <p className="text-xs text-slate-600 mt-1">Start watching videos to track your activity</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Profile;
