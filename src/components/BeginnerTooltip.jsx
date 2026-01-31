import React from 'react';
import { Info } from 'lucide-react';

export default function BeginnerTooltip({ text, position = 'top' }) {
  const [show, setShow] = React.useState(false);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };
  
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="text-blue-400 hover:text-blue-300 transition-colors"
      >
        <Info size={16} />
      </button>
      
      {show && (
        <div 
          className={`absolute z-50 ${positionClasses[position]} w-64 animate-fade-in`}
        >
          <div className="bg-blue-900/95 backdrop-blur-sm border-2 border-blue-500/50 rounded-xl p-4 shadow-xl">
            <div className="text-white text-sm leading-relaxed">
              💡 {text}
            </div>
          </div>
          
          {/* Arrow */}
          <div 
            className={`absolute w-3 h-3 bg-blue-900/95 border-blue-500/50 rotate-45 ${
              position === 'top' ? 'bottom-[-7px] left-1/2 -translate-x-1/2 border-r-2 border-b-2' :
              position === 'bottom' ? 'top-[-7px] left-1/2 -translate-x-1/2 border-l-2 border-t-2' :
              position === 'left' ? 'right-[-7px] top-1/2 -translate-y-1/2 border-t-2 border-r-2' :
              'left-[-7px] top-1/2 -translate-y-1/2 border-b-2 border-l-2'
            }`}
          />
        </div>
      )}
    </div>
  );
}
