import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import StockChart from './StockChart';

function StockCard({ stock, onBuy, onSell, owned = 0, canAfford, badge, theme }) {
  const isUp = stock.trend === 'up';
  const isDown = stock.trend === 'down';
  
  return (
    <div
      className="stock-card-hover glass-panel p-8 flex flex-col rounded-[2.5rem] border border-white/8 relative overflow-hidden"
      style={{ boxShadow: theme?.accent ? `0 25px 50px ${theme.accent}25` : undefined }}
    >
      {badge && (
        <div className={`absolute top-5 right-5 text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${
          badge.color === 'emerald'
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
            : badge.color === 'indigo'
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40'
              : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40'
        }`}
        >
          {badge.label}
        </div>
      )}
      <div className="text-6xl mb-4">{stock.emoji}</div>
      <h3 className="font-black text-xl text-white">{stock.name}</h3>
      <p className="text-[10px] uppercase font-black text-slate-500 mb-4">{stock.riskLevel || 'Mid'} Risk</p>
      
      {/* Stock Trend Chart */}
      <div className="mb-4">
        <StockChart history={stock.history || []} trend={stock.trend} />
      </div>
      
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl font-black tracking-tighter text-white">${stock.price.toFixed(2)}</span>
        <span className={`text-[0.75rem] px-3 py-1 rounded-full font-black border ${
          isUp ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
          isDown ? 'bg-red-500/10 text-red-400 border-red-500/20' :
          'bg-slate-500/10 text-slate-400 border-slate-500/20'
        }`}>
          {isUp && '+Up'}
          {isDown && '-Down'}
          {!isUp && !isDown && 'Stable'}
        </span>
      </div>
      
      <div className="flex gap-3 mt-auto">
        <button
          onClick={() => onBuy(stock.id)}
          disabled={!canAfford}
          className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase transition active:scale-95 ${
            canAfford
              ? 'bg-white text-black hover:bg-gray-200'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => onSell(stock.id)}
          disabled={owned === 0}
          className={`flex-1 py-4 rounded-2xl font-bold text-xs uppercase transition active:scale-95 ${
            owned > 0
              ? 'border border-white/10 hover:bg-white/5 text-white'
              : 'border border-white/5 text-slate-600 cursor-not-allowed'
          }`}
        >
          Sell
        </button>
      </div>
      
      <div className="mt-6 pt-5 border-t border-white/5 flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-500 uppercase">Owned</span>
        <span className="text-xl font-black text-emerald-400">{owned}</span>
      </div>
    </div>
  );
}

export default StockCard;