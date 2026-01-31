import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const TradeHistory = ({ history }) => {
  return (
    <aside className="lg:w-96 border-l border-white/10 bg-slate-950/40 backdrop-blur-md sticky top-[140px] h-[calc(100vh-140px)] flex flex-col">
      <div className="p-6 border-b border-white/10 bg-white/5">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400">Trade Ledger</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {history.length === 0 ? (
          <p className="text-xs text-slate-600 text-center mt-20 italic font-medium">
            Ready for your first move, investor? 🎯
          </p>
        ) : (
          history.map((trade, index) => (
            <div
              key={index}
              className={`glass-panel p-4 rounded-[1.5rem] border-l-4 ${
                trade.type === 'BUY'
                  ? 'border-emerald-500 bg-emerald-500/5'
                  : 'border-red-500 bg-red-500/5'
              } animate-slide-in`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {trade.type === 'BUY' ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-[9px] font-black uppercase tracking-widest ${
                    trade.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {trade.type}
                  </span>
                </div>
                <span className="text-slate-600 text-[9px] font-bold uppercase">
                  {trade.time}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{trade.emoji}</span>
                  <span className="text-xs font-bold text-white">{trade.name}</span>
                </div>
                <span className={`text-white font-black text-lg ${
                  trade.type === 'BUY' ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {trade.type === 'BUY' ? '-' : '+'}${trade.price.toFixed(2)}
                </span>
              </div>
              
              {trade.profit !== undefined && trade.type === 'SELL' && (
                <div className={`text-[10px] font-bold mt-2 text-right ${
                  trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)} profit
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default TradeHistory;
