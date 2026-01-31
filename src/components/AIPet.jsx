import React, { useState, useEffect } from 'react';
import PetModel3D from './PetModel3D';

function AIPet({ currentTip, petName = "Penny" }) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    // Animate when tip changes
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentTip]);
  
  return (
    <div className="bg-slate-800 rounded-3xl p-6 border-4 border-slate-700 shadow-xl relative overflow-visible mt-12 mb-8">
      <div className="flex items-center gap-6">
        
        {/* 3D Pet Container */}
        <div className="relative -mt-20 flex-shrink-0">
          <div className="w-32 h-32 bg-indigo-600 rounded-full border-4 border-white shadow-lg overflow-hidden relative z-10">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-indigo-800 opacity-50"></div>
             <PetModel3D />
          </div>
          {/* Name Tag */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 border-2 border-white px-3 py-1 rounded-full text-sm font-black shadow-md whitespace-nowrap z-20">
            {petName}
          </div>
        </div>
        
        {/* Speech Bubble */}
        <div className="flex-1 relative">
          <div className="bg-white text-slate-800 p-5 rounded-2xl rounded-tl-none shadow-lg border-2 border-indigo-100 relative">
             {/* Pointer */}
             <div className="absolute -left-2 top-0 w-4 h-4 bg-white border-l-2 border-t-2 border-indigo-100 transform -rotate-45"></div>
             
             <p className={`
              text-lg font-bold transition-all duration-300
              ${isAnimating ? 'opacity-50 scale-[0.99]' : 'opacity-100 scale-100'}
            `}>
              {currentTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIPet;