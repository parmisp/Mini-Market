import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';
import { speakAsStocky, stopSpeech } from '../utils/speech';

function AIPet({ currentTip, petName = "Stocky" }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => stopSpeech();
  }, []);

  // Auto-speak whenever tip changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);

    if (audioEnabled && currentTip) {
      handleSpeak(currentTip);
    }

    return () => clearTimeout(timer);
  }, [currentTip]);

  const handleSpeak = async (text) => {
    setIsSpeaking(true);
    await speakAsStocky(text);
    // Estimate how long the audio plays based on text length
    setTimeout(() => setIsSpeaking(false), text.length * 60);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (audioEnabled) stopSpeech();
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-6 border border-purple-500 relative overflow-hidden">
      {/* Top right controls */}
      <div className="absolute top-3 right-3 flex gap-2 items-center">
        <button
          onClick={toggleAudio}
          className={`p-2 rounded-lg transition-all ${
            audioEnabled
              ? 'bg-purple-600 hover:bg-purple-500'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
          title={audioEnabled ? "Mute Stocky" : "Unmute Stocky"}
        >
          {audioEnabled
            ? <Volume2 className="text-white" size={18} />
            : <VolumeX className="text-gray-400" size={18} />
          }
        </button>
        <Sparkles className="text-yellow-400 animate-pulse" size={22} />
      </div>

      {/* Owl + Speech Bubble */}
      <div className="flex items-start gap-4">
        {/* Owl side */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className={`
            text-6xl transition-all duration-300
            ${isAnimating ? 'scale-110' : 'scale-100'}
            ${isSpeaking ? 'animate-bounce' : ''}
          `}>
            🦉
          </div>
          <p className="text-yellow-400 font-bold text-sm mt-1">{petName}</p>

          {/* Speaking dots */}
          {isSpeaking && (
            <div className="flex gap-1 mt-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
            </div>
          )}
        </div>

        {/* Speech bubble side */}
        <div className="flex-1">
          <div className="bg-white rounded-lg p-4 relative">
            {/* Pointer triangle */}
            <div className="absolute left-0 top-4 -ml-2 w-0 h-0
              border-t-8 border-t-transparent
              border-r-8 border-r-white
              border-b-8 border-b-transparent">
            </div>

            <p className={`
              text-gray-800 font-medium transition-all duration-300
              ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
            `}>
              {currentTip}
            </p>

            {/* Replay button */}
            {audioEnabled && (
              <button
                onClick={() => handleSpeak(currentTip)}
                className="mt-3 text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
              >
                <Volume2 size={12} />
                Replay
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIPet;