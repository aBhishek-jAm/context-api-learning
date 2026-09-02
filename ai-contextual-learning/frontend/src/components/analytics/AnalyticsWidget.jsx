import React from 'react';
import { Activity, Zap, CheckCircle } from 'lucide-react';

const AnalyticsWidget = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 hover:border-slate-700 transition-colors">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
          <Activity className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <p className="text-xs text-slate-400">Total Queries</p>
          <h4 className="text-xl font-bold text-slate-100">1,284</h4>
        </div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 hover:border-slate-700 transition-colors">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <p className="text-xs text-slate-400">Helpful Rate</p>
          <h4 className="text-xl font-bold text-slate-100">94.2%</h4>
        </div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 hover:border-slate-700 transition-colors">
        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
          <Zap className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <p className="text-xs text-slate-400">Avg AI Latency</p>
          <h4 className="text-xl font-bold text-slate-100">1.2s</h4>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsWidget;
