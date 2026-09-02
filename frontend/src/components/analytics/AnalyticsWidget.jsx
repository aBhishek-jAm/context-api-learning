import React from 'react';
import { Activity, Zap, CheckCircle } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

const AnalyticsWidget = () => {
  const { totalQueries, helpfulCount, latencies } = useAppState();

  // Calculate average latency in seconds
  const avgLatency = latencies.length > 0
    ? (latencies.reduce((sum, l) => sum + l, 0) / latencies.length / 1000).toFixed(1)
    : '0.0';

  // Calculate helpful rate as percentage
  const helpfulRate = totalQueries > 0
    ? ((helpfulCount / totalQueries) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 hover:border-slate-700 transition-colors">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
          <Activity className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <p className="text-xs text-slate-400">Total Queries</p>
          <h4 className="text-xl font-bold text-slate-100">{totalQueries.toLocaleString()}</h4>
        </div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 hover:border-slate-700 transition-colors">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <p className="text-xs text-slate-400">Helpful Rate</p>
          <div className="flex items-baseline gap-1.5">
            <h4 className="text-xl font-bold text-slate-100">{helpfulRate}%</h4>
            {totalQueries > 0 && (
              <span className="text-[10px] text-slate-500">{helpfulCount}/{totalQueries}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 hover:border-slate-700 transition-colors">
        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
          <Zap className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <p className="text-xs text-slate-400">Avg AI Latency</p>
          <div className="flex items-baseline gap-1.5">
            <h4 className="text-xl font-bold text-slate-100">{avgLatency}s</h4>
            {latencies.length > 0 && (
              <span className="text-[10px] text-slate-500">{latencies.length} calls</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsWidget;
