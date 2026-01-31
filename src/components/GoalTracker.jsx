import React from 'react';
import { Trophy, Star } from 'lucide-react';

function GoalTracker({ currentBalance, goal = 200 }) {
  const progress = Math.min((currentBalance / goal) * 100, 100);
  const remaining = Math.max(goal - currentBalance, 0);
  
  return (
    <div className="bg-slate-800 rounded-3xl p-6 border-4 border-slate-700 shadow-xl relative overflow-hidden group hover:scale-[1.01] transition-transform">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Trophy size={150} />
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-black text-xl flex items-center gap-2">
              <span className="text-yellow-400">🏆</span> Goal: Reach ${goal}
            </h3>
            <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm font-bold">
              {progress.toFixed(0)}%
            </span>
          </div>
          
          {/* Fun Progress Bar Container */}
          <div className="h-8 bg-slate-900 rounded-full border-2 border-slate-600 p-1 relative shadow-inner">
            {/* The Bar */}
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-300 rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_15px_rgba(251,191,36,0.5)]"
              style={{ width: `${progress}%` }}
            >
              {/* Shine effect */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white/30 rounded-t-full"></div>
              
              {/* Sparkles at the end of the bar */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                <div className="animate-spin-slow">
                   <Star size={20} className="fill-yellow-100 text-yellow-600" />
                </div>
              </div>
            </div>
            
            {/* Milestones */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-slate-700/50"></div>
          </div>
          
          <p className="text-slate-400 text-sm font-bold mt-2 text-right">
             {remaining > 0 ? (
               <span>Only <span className="text-white">${remaining.toFixed(2)}</span> left to go!</span>
             ) : (
               <span className="text-yellow-400">GOAL REACHED! 🎉</span>
             )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default GoalTracker;