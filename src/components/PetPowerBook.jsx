import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { getPetPowerList } from '../utils/petPowers';

export default function PetPowerBook({ isOpen, onClose, currentName }) {
  if (!isOpen) return null;

  const powers = getPetPowerList();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-slate-900/95 border-2 border-indigo-500/40 rounded-3xl shadow-[0_0_60px_rgba(99,102,241,0.35)] overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <Sparkles className="text-yellow-300" /> Pet Power Book
            </h2>
            <p className="text-white/70 text-sm">Name your pet to unlock secret powers & easter eggs.</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="mb-4 text-xs text-white/60">
            Tip: try famous names, memes, or the secret name 👀
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {powers.map((power) => (
              <div
                key={power.key}
                className={`p-4 rounded-2xl border-2 transition-all bg-slate-800/60 ${
                  currentName?.toLowerCase() === power.key
                    ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.35)]'
                    : 'border-white/10 hover:border-indigo-400/60'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl">{power.emoji}</div>
                  <div>
                    <div className="text-xs text-white/50 uppercase tracking-widest font-black">
                      Name: {power.key}
                    </div>
                    <div className="text-lg text-white font-black">{power.name}</div>
                  </div>
                </div>
                <div className="text-sm text-white/70 mb-2">{power.description}</div>
                <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
                  {power.effect}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
