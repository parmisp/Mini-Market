import React from 'react';
import { X, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

function TutorialModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-['Nunito']">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-slate-800 rounded-3xl p-8 max-w-2xl w-full border-2 border-slate-700 shadow-2xl animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-700 hover:bg-slate-600 rounded-full p-2 transition-colors"
        >
          <X className="text-white" size={24} />
        </button>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-4xl font-black text-white mb-2">HOW TO PLAY</h2>
          <p className="text-white/60">Master the market in 4 easy steps!</p>
        </div>
        
        {/* Steps */}
        <div className="space-y-6 mb-8">
          {/* Step 1 */}
          <div className="bg-slate-700/50 rounded-2xl p-6 border-l-4 border-emerald-500">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <DollarSign className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white mb-2">1️⃣ BUY STOCKS</h3>
                <p className="text-white/70">Click BUY when prices are low! Use your cash wisely.</p>
              </div>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="bg-slate-700/50 rounded-2xl p-6 border-l-4 border-indigo-500">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white mb-2">2️⃣ WATCH PRICES</h3>
                <p className="text-white/70 mb-2">Prices change every 15 seconds</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <TrendingUp size={16} /> Going UP
                  </span>
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <TrendingDown size={16} /> Going DOWN
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="bg-slate-700/50 rounded-2xl p-6 border-l-4 border-yellow-500">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💰</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white mb-2">3️⃣ SELL FOR PROFIT</h3>
                <p className="text-white/70">Sell when prices are higher than what you paid! Make that money!</p>
              </div>
            </div>
          </div>
          
          {/* Step 4 */}
          <div className="bg-slate-700/50 rounded-2xl p-6 border-l-4 border-purple-500">
            <div className="flex items-start gap-4">
              <div className="bg-purple-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <Target className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white mb-2">4️⃣ REACH YOUR GOAL</h3>
                <p className="text-white/70">Turn $100 into $200 and become a trading master!</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pro Tip */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-6 border border-indigo-500/50 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl">💡</div>
            <div>
              <h4 className="text-xl font-black text-white mb-1">PRO TIP</h4>
              <p className="text-white/80">Buy low, sell high! Watch the trends and listen to your AI pet's advice!</p>
            </div>
          </div>
        </div>
        
        {/* Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white font-black text-xl px-8 py-4 rounded-xl shadow-[0_4px_0_0_rgba(22,163,74,1)] hover:shadow-[0_2px_0_0_rgba(22,163,74,1)] hover:translate-y-1 transition-all"
        >
          GOT IT! LET'S TRADE! 🚀
        </button>
      </div>
    </div>
  );
}

export default TutorialModal;
