import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, GraduationCap, Users, Clock, Activity } from 'lucide-react';

const AnalyticsSection = ({ analytics, students }) => {
  if (!analytics) return null;

  const { registrationTrend, levelDistribution, totalStudents, newLast7Days, newLast30Days, totalTranscripts } = analytics;

  // Cumulative growth data from students
  const growthData = useMemo(() => {
    if (!students.length) return [];
    const sorted = [...students].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const days = {};
    sorted.forEach((s, i) => {
      const day = new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days[day] = i + 1;
    });
    return Object.entries(days).map(([label, count]) => ({ label, count }));
  }, [students]);

  const maxGrowth = Math.max(...growthData.map(d => d.count), 1);

  // Activity metrics from real data
  const avgPerDay = totalStudents > 0 ? (newLast7Days / 7).toFixed(1) : '0';
  const growthRate = newLast30Days > 0 && totalStudents > newLast30Days
    ? ((newLast30Days / (totalStudents - newLast30Days)) * 100).toFixed(0)
    : newLast30Days > 0 ? '100' : '0';

  // Level bar chart data
  const levels = [
    { label: 'Beginner', count: levelDistribution.beginner, color: 'from-emerald-600 to-emerald-400', bg: 'bg-emerald-500/10', text: 'text-emerald-400', emoji: '🌱' },
    { label: 'Intermediate', count: levelDistribution.intermediate, color: 'from-amber-600 to-amber-400', bg: 'bg-amber-500/10', text: 'text-amber-400', emoji: '📚' },
    { label: 'Advanced', count: levelDistribution.advanced, color: 'from-rose-600 to-rose-400', bg: 'bg-rose-500/10', text: 'text-rose-400', emoji: '🚀' },
  ];
  const maxLevel = Math.max(...levels.map(l => l.count), 1);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard icon={Activity} label="Avg. Signups / Day" value={avgPerDay} color="blue" sub="Last 7 days" />
        <MetricCard icon={TrendingUp} label="Growth Rate" value={`${growthRate}%`} color="emerald" sub="30-day new / existing" />
        <MetricCard icon={Users} label="Active Students" value={totalStudents} color="amber" sub="All registered" />
        <MetricCard icon={BarChart3} label="Transcripts" value={totalTranscripts} color="purple" sub="Total ingested" />
      </div>

      {/* Horizontal Level Bars */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-amber-400" /> Learning Level Breakdown
        </h3>
        <p className="text-xs text-slate-500 mb-5">Horizontal comparison of student learning levels</p>
        <div className="space-y-4">
          {levels.map((lv, i) => (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-sm font-medium ${lv.text} flex items-center gap-1.5`}>{lv.emoji} {lv.label}</span>
                <span className="text-sm font-bold text-slate-200">{lv.count}</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${lv.color} transition-all duration-700 group-hover:shadow-lg`}
                  style={{ width: `${(lv.count / maxLevel) * 100}%`, minWidth: lv.count > 0 ? '8px' : '0' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cumulative Growth */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" /> Cumulative Student Growth
        </h3>
        <p className="text-xs text-slate-500 mb-5">Total students over time</p>

        {growthData.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No registration data available yet</div>
        ) : (
          <div className="relative h-48">
            {/* Y-axis grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
              <div key={pct} className="absolute left-8 right-0 border-t border-slate-800/60" style={{ bottom: `${pct * 100}%` }}>
                <span className="absolute -left-8 -top-2 text-[9px] text-slate-600 font-mono">{Math.round(maxGrowth * pct)}</span>
              </div>
            ))}
            {/* SVG area chart */}
            <svg viewBox={`0 0 ${growthData.length * 40} 192`} className="absolute inset-0 w-full h-full ml-8" preserveAspectRatio="none" style={{ width: 'calc(100% - 32px)' }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Area */}
              <path
                d={`M0,192 ${growthData.map((d, i) => `L${i * 40 + 20},${192 - (d.count / maxGrowth) * 180}`).join(' ')} L${(growthData.length - 1) * 40 + 20},192 Z`}
                fill="url(#areaGrad)"
              />
              {/* Line */}
              <polyline
                points={growthData.map((d, i) => `${i * 40 + 20},${192 - (d.count / maxGrowth) * 180}`).join(' ')}
                fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
              {/* Dots */}
              {growthData.map((d, i) => (
                <circle key={i} cx={i * 40 + 20} cy={192 - (d.count / maxGrowth) * 180} r="3" fill="#3b82f6" stroke="#0f172a" strokeWidth="2" />
              ))}
            </svg>
          </div>
        )}

        {growthData.length > 0 && (
          <div className="flex gap-4 mt-4 overflow-x-auto pl-8">
            {growthData.slice(-10).map((d, i) => (
              <span key={i} className="text-[9px] text-slate-500 whitespace-nowrap">{d.label}</span>
            ))}
          </div>
        )}
      </div>

      {/* Registration Heatmap (7-day) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" /> 7-Day Registration Activity
        </h3>
        <p className="text-xs text-slate-500 mb-5">Heat intensity shows registration volume</p>
        <div className="grid grid-cols-7 gap-2">
          {registrationTrend.map((day, i) => {
            const intensity = totalStudents > 0 ? Math.min(day.count / Math.max(...registrationTrend.map(d => d.count), 1), 1) : 0;
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className="w-full aspect-square rounded-xl border border-slate-700/50 flex items-center justify-center text-sm font-bold transition-all hover:scale-105"
                  style={{
                    backgroundColor: day.count > 0 ? `rgba(59,130,246,${0.1 + intensity * 0.5})` : 'rgba(30,41,59,0.5)',
                    borderColor: day.count > 0 ? `rgba(59,130,246,${0.2 + intensity * 0.3})` : undefined,
                    color: day.count > 0 ? '#93c5fd' : '#475569'
                  }}
                >
                  {day.count}
                </div>
                <span className="text-[10px] text-slate-500">{day.label.split(',')[0].split(' ')[0]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, color, sub }) => {
  const colorMap = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  };
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
};

export default AnalyticsSection;
