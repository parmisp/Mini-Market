import React, { useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';

function AchievementModal({ achievement, onClose }) {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    setShow(true);
  }, []);
  
  if (!achievement) return null;
  
  const achievements = {
    25: { title: 'QUARTER MASTER!', emoji: '🥉', desc: 'You\'ve reached $25 net worth!' },
    50: { title: 'HALF CENTURY!', emoji: '🥈', desc: 'You\'ve reached $50 net worth!' },
    75: { title: 'THREE QUARTERS!', emoji: '🏅', desc: 'You\'ve reached $75 net worth!' },
    100: { title: 'CENTURY CLUB!', emoji: '💯', desc: 'You\'ve reached $100 net worth!' },
    150: { title: 'PROFIT MASTER!', emoji: '💎', desc: 'You\'ve reached $150 net worth!' },
    200: { title: 'GOAL CRUSHER!', emoji: '🏆', desc: 'You\'ve reached $200 and WON!' }
  };
  
  const current = achievements[achievement] || achievements[25];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-['Nunito']">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"></div>
      
      {/* Confetti Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-confetti-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10%',
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${2 + Math.random() * 1}s`
            }}
          >
            {['🎉', '✨', '💰', '🌟', '⭐'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>
      
      {/* Modal Content */}
      <div className={`relative bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-8 max-w-md w-full border-4 border-yellow-400 shadow-[0_0_50px_rgba(251,191,36,0.5)] ${show ? 'animate-fade-in' : ''}`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          <X className="text-white" size={24} />
        </button>
        
        {/* Content */}
        <div className="text-center">
          <div className="text-yellow-400 font-black text-xl mb-4 animate-pulse">
            ✨ ACHIEVEMENT UNLOCKED! ✨
          </div>
          
          <div className="text-8xl mb-6 animate-bounce-slow">
            {current.emoji}
          </div>
          
          <h2 className="text-4xl font-black text-white mb-4 drop-shadow-lg">
            {current.title}
          </h2>
          
          <p className="text-xl text-white/80 mb-6">
            {current.desc}
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <div className="text-emerald-400 text-3xl font-black">+10 XP Earned!</div>
          </div>
          
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-emerald-500 to-green-400 text-white font-black text-xl px-8 py-4 rounded-xl shadow-[0_4px_0_0_rgba(22,163,74,1)] hover:shadow-[0_2px_0_0_rgba(22,163,74,1)] hover:translate-y-1 transition-all w-full"
          >
            AWESOME! →
          </button>
        </div>
      </div>
    </div>
  );
}

export default AchievementModal;
