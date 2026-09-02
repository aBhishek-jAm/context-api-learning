import React from 'react';
import { Users, UserPlus, GraduationCap, BookOpen, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const OverviewSection = ({ analytics, students }) => {
  if (!analytics) return null;

  const { totalStudents, newLast7Days, newLast30Days, levelDistribution, registrationTrend, totalTranscripts, recentRegistrations } = analytics;
  const maxTrendCount = Math.max(...registrationTrend.map(d => d.count), 1);

  // Donut chart calculations
  const total = (levelDistribution.beginner + levelDistribution.intermediate + levelDistribution.advanced) || 1;
  const segments = [
    { label: 'Beginner', count: levelDistribution.beginner, color: '#10b981', emoji: '🌱' },
    { label: 'Intermediate', count: levelDistribution.intermediate, color: '#f59e0b', emoji: '📚' },
    { label: 'Advanced', count: levelDistribution.advanced, color: '#f43f5e', emoji: '🚀' },
  ];

  // SVG donut
  const radius = 52, strokeWidth = 14, circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard icon={Users} label="Total Students" value={totalStudents} color="blue" />
        <KPICard icon={UserPlus} label="New (7 Days)" value={newLast7Days} color="emerald" sub={`${newLast30Days} in 30 days`} />
        <KPICard icon={GraduationCap} label="Learning Levels" color="amber" custom={
          <div className="flex gap-3 text-sm mt-1">
            <span className="text-emerald-400">🌱 {levelDistribution.beginner}</span>
            <span className="text-amber-400">📚 {levelDistribution.intermediate}</span>
            <span className="text-rose-400">🚀 {levelDistribution.advanced}</span>
          </div>
        } />
        <KPICard icon={BookOpen} label="Transcripts Ingested" value={totalTranscripts} color="purple" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Trend */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" /> Registration Trend (Last 7 Days)
          </h3>
          <p className="text-xs text-slate-500 mb-5">Daily new student sign-ups</p>

          <div className="flex items-end gap-2 h-40">
            {registrationTrend.map((day, i) => {
              const height = maxTrendCount > 0 ? (day.count / maxTrendCount) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity font-mono">{day.count}</span>
                  <div className="w-full relative" style={{ height: '128px' }}>
                    <div
                      className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 group-hover:from-blue-500 group-hover:to-blue-300 transition-all duration-300 shadow-sm shadow-blue-500/20"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 whitespace-nowrap">{day.label.split(',')[0].split(' ').slice(0, 1)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level Distribution Donut */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2 self-start">
            <GraduationCap className="w-4 h-4 text-amber-400" /> Level Distribution
          </h3>
          <p className="text-xs text-slate-500 mb-4 self-start">Student learning levels</p>

          <svg width="140" height="140" viewBox="0 0 140 140" className="mb-4">
            {segments.map((seg, i) => {
              const pct = seg.count / total;
              const dashLength = pct * circumference;
              const dashOffset = -offset;
              offset += dashLength;
              return (
                <circle
                  key={i}
                  cx="70" cy="70" r={radius}
                  fill="none" stroke={seg.color} strokeWidth={strokeWidth}
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-700"
                  style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                />
              );
            })}
            <text x="70" y="66" textAnchor="middle" className="fill-white text-2xl font-bold" style={{fontSize: '24px'}}>{total}</text>
            <text x="70" y="82" textAnchor="middle" className="fill-slate-400" style={{fontSize: '10px'}}>students</text>
          </svg>

          <div className="space-y-2 w-full">
            {segments.map((seg, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                  {seg.emoji} {seg.label}
                </span>
                <span className="font-semibold text-slate-200">{seg.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-emerald-400" /> Recent Registrations
        </h3>
        {recentRegistrations.length === 0 ? (
          <p className="text-sm text-slate-500">No recent registrations</p>
        ) : (
          <div className="space-y-3">
            {recentRegistrations.map((s) => (
              <div key={s._id} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-400">{s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.email}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500">{new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const KPICard = ({ icon: Icon, label, value, color, sub, custom }) => {
  const colorMap = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  };
  const iconColor = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      {custom ? custom : (
        <>
          <p className="text-3xl font-bold text-white">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </>
      )}
    </div>
  );
};

export default OverviewSection;
