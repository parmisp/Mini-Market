import React, { useState } from 'react';
import { Volume2, VolumeX, Palette, Heart, Zap, RotateCcw, Download } from 'lucide-react';

const SettingsDropdown = ({ isOpen, onClose, userData, onUpdateSettings }) => {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    theme: 'space',
    petPersonality: 'friendly',
    difficulty: 'medium'
  });
  
  const handleToggle = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onUpdateSettings?.(newSettings);
  };
  
  const handleReset = () => {
    if (confirm('⚠️ Are you sure you want to reset all progress? This cannot be undone!')) {
      window.location.reload();
    }
  };
  
  const handleExport = () => {
    const data = JSON.stringify({ userData, settings }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moneykids-${userData?.name || 'data'}-${Date.now()}.json`;
    a.click();
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Dropdown Panel */}
      <div className="absolute right-4 top-16 z-50 w-96 bg-slate-800/95 backdrop-blur-xl border-2 border-indigo-500/30 rounded-2xl shadow-2xl animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 border-b border-indigo-500/30">
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            ⚙️ SETTINGS
          </h3>
          <p className="text-indigo-200 text-sm mt-1">Customize your trading experience</p>
        </div>
        
        {/* Settings Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Sound Effects */}
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {settings.soundEnabled ? (
                  <Volume2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <VolumeX className="w-6 h-6 text-slate-500" />
                )}
                <div>
                  <h4 className="text-white font-bold text-lg">Sound Effects</h4>
                  <p className="text-slate-400 text-xs">Trade sounds & alerts</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('soundEnabled', !settings.soundEnabled)}
                className={`w-14 h-8 rounded-full transition-all duration-300 ${
                  settings.soundEnabled 
                    ? 'bg-emerald-500' 
                    : 'bg-slate-600'
                }`}
              >
                <div 
                  className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 ${
                    settings.soundEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          
          {/* Theme Selector */}
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <Palette className="w-6 h-6 text-purple-400" />
              <div>
                <h4 className="text-white font-bold text-lg">Theme</h4>
                <p className="text-slate-400 text-xs">Change your background</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'space', name: 'Space 🌌', color: 'from-indigo-900 to-purple-900' },
                { id: 'ocean', name: 'Ocean 🌊', color: 'from-blue-900 to-cyan-900' },
                { id: 'forest', name: 'Forest 🌲', color: 'from-green-900 to-emerald-900' }
              ].map(theme => (
                <button
                  key={theme.id}
                  onClick={() => handleToggle('theme', theme.id)}
                  className={`p-3 rounded-lg bg-gradient-to-br ${theme.color} border-2 transition-all ${
                    settings.theme === theme.id 
                      ? 'border-white scale-105' 
                      : 'border-slate-700 hover:scale-105'
                  }`}
                >
                  <div className="text-xs font-bold text-white text-center">
                    {theme.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Pet Personality */}
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-6 h-6 text-rose-400" />
              <div>
                <h4 className="text-white font-bold text-lg">Pet Personality</h4>
                <p className="text-slate-400 text-xs">How your owl behaves</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { id: 'friendly', name: 'Friendly', emoji: '😊', desc: 'Always supportive' },
                { id: 'wise', name: 'Wise', emoji: '🧙', desc: 'Deep insights' },
                { id: 'silly', name: 'Silly', emoji: '🤪', desc: 'Fun & jokes' }
              ].map(personality => (
                <button
                  key={personality.id}
                  onClick={() => handleToggle('petPersonality', personality.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                    settings.petPersonality === personality.id
                      ? 'bg-rose-500/20 border-rose-400'
                      : 'bg-slate-800/50 border-slate-700 hover:border-rose-400/50'
                  }`}
                >
                  <div className="text-2xl">{personality.emoji}</div>
                  <div className="text-left flex-1">
                    <div className="text-white font-bold">{personality.name}</div>
                    <div className="text-slate-400 text-xs">{personality.desc}</div>
                  </div>
                  {settings.petPersonality === personality.id && (
                    <div className="text-rose-400 text-xl">✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Difficulty Level */}
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-yellow-400" />
              <div>
                <h4 className="text-white font-bold text-lg">Difficulty</h4>
                <p className="text-slate-400 text-xs">Price volatility</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { id: 'easy', name: 'Easy', emoji: '🟢', desc: 'Small price swings' },
                { id: 'medium', name: 'Medium', emoji: '🟡', desc: 'Normal volatility' },
                { id: 'hard', name: 'Hard', emoji: '🔴', desc: 'Big swings!' }
              ].map(level => (
                <button
                  key={level.id}
                  onClick={() => handleToggle('difficulty', level.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                    settings.difficulty === level.id
                      ? 'bg-yellow-500/20 border-yellow-400'
                      : 'bg-slate-800/50 border-slate-700 hover:border-yellow-400/50'
                  }`}
                >
                  <div className="text-2xl">{level.emoji}</div>
                  <div className="text-left flex-1">
                    <div className="text-white font-bold">{level.name}</div>
                    <div className="text-slate-400 text-xs">{level.desc}</div>
                  </div>
                  {settings.difficulty === level.id && (
                    <div className="text-yellow-400 text-xl">✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Danger Zone */}
          <div className="bg-red-900/20 rounded-xl p-4 border-2 border-red-500/30">
            <h4 className="text-red-400 font-bold text-lg mb-3 flex items-center gap-2">
              ⚠️ DANGER ZONE
            </h4>
            <div className="space-y-2">
              <button
                onClick={handleExport}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 hover:border-blue-400 transition-all flex items-center gap-3 text-blue-300"
              >
                <Download className="w-5 h-5" />
                <span className="font-bold">Export Save Data</span>
              </button>
              <button
                onClick={handleReset}
                className="w-full p-3 rounded-lg bg-red-500/20 border border-red-500 hover:bg-red-500/30 transition-all flex items-center gap-3 text-red-300"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="font-bold">Reset All Progress</span>
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default SettingsDropdown;
