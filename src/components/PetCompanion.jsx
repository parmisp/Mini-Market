import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Zap, Sparkles, Heart } from 'lucide-react';

// Owl 3D Model
function OwlModel() {
  const { scene } = useGLTF('/owl.glb');
  return <primitive object={scene} scale={1.2} position={[0, -0.3, 0]} />;
}

export default function PetCompanion({ petName, petPower, balance, theme, personality, onPetBoost }) {
  const [isHappy, setIsHappy] = useState(false);
  const [showPowerAnim, setShowPowerAnim] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [petMessage, setPetMessage] = useState('Tap me for a high‑five!');

  const mood = balance > 150 ? 'excited' : balance < 50 ? 'worried' : 'idle';

  // Animate pet when clicking
  const handlePetClick = () => {
    setIsHappy(true);
    if (petPower) {
      setShowPowerAnim(true);
      setTimeout(() => setShowPowerAnim(false), 2000);
    }
    setTimeout(() => setIsHappy(false), 1000);
  };

  const handlePetBoost = () => {
    if (cooldown) return;
    setCooldown(true);
    const boosts = [
      { type: 'coins', amount: 2 },
      { type: 'coins', amount: 3 },
      { type: 'discount' },
      { type: 'freeze' }
    ];
    if (petPower?.ability === 'secret-hoot') {
      boosts.push({ type: 'secret-hoot' });
    }
    const bonus = boosts[Math.floor(Math.random() * boosts.length)];
    onPetBoost?.(bonus);
    setPetMessage('✨ Power Spark activated!');
    setTimeout(() => {
      setCooldown(false);
      setPetMessage('Tap me for a high‑five!');
    }, 4000);
  };

  const themeColors = {
    space: { bg: 'from-indigo-600 to-purple-600', accent: '#8b5cf6' },
    neon: { bg: 'from-pink-500 to-cyan-500', accent: '#ec4899' },
    ocean: { bg: 'from-blue-500 to-teal-500', accent: '#06b6d4' },
    forest: { bg: 'from-green-600 to-emerald-600', accent: '#10b981' }
  };

  const currentTheme = themeColors[theme] || themeColors.space;

  return (
    <div className="fixed bottom-8 left-8 z-30">
      {/* Pet Container */}
      <div className="relative">
        {/* Secret Glow */}
        {petPower?.ability === 'secret-hoot' && (
          <div className="absolute inset-0 rounded-full blur-3xl opacity-50 animate-pulse" style={{ background: `radial-gradient(circle, ${currentTheme.accent} 0%, transparent 70%)` }} />
        )}
        {/* Power Indicator */}
        {petPower && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 animate-bounce">
            <div className="glass-panel p-3 rounded-2xl border-2" style={{ borderColor: petPower.color }}>
              <div className="flex items-center gap-2 justify-center">
                <span className="text-2xl">{petPower.emoji}</span>
                <div className="text-xs">
                  <div className="font-black text-white">{petPower.name}</div>
                  <div className="text-white/70">{petPower.description}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Power Animation */}
        {showPowerAnim && petPower && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute text-3xl animate-ping"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-60px)`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s'
                }}
              >
                {petPower.emoji}
              </div>
            ))}
          </div>
        )}

        {/* Pet 3D Model */}
        <div
          onClick={handlePetClick}
          className={`w-40 h-40 rounded-full cursor-pointer transition-all duration-300 ${
            isHappy ? 'scale-110' : 'scale-100'
          } hover:scale-105 shadow-2xl border-4 border-white/20 overflow-hidden`}
          style={{
            background: `linear-gradient(135deg, ${currentTheme.bg})`,
            boxShadow: `0 20px 50px ${currentTheme.accent}50`
          }}
        >
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 4]} />
            <ambientLight intensity={0.8} />
            <directionalLight position={[3, 3, 3]} intensity={1.2} />
            <pointLight position={[-3, 3, 3]} intensity={0.6} color={currentTheme.accent} />
            <OwlModel />
            <OrbitControls
              enableZoom={false}
              autoRotate
              autoRotateSpeed={isHappy ? 8 : 2}
              enablePan={false}
            />
          </Canvas>
        </div>

        {/* Mood Indicator */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 px-4 py-1 rounded-full border border-white/20 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {mood === 'excited' && '🎉'}
              {mood === 'worried' && '😰'}
              {mood === 'idle' && '😊'}
            </span>
            <span className="text-xs font-bold text-white">{petName}</span>
          </div>
        </div>

        {/* Click Me Hint */}
        {!isHappy && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white/50 animate-pulse whitespace-nowrap">
            ✨ Click me! ✨
          </div>
        )}
      </div>

      {/* Pet Trick Button */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <button
          onClick={handlePetBoost}
          disabled={cooldown}
          className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
            cooldown
              ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
              : 'bg-linear-to-r from-emerald-500 to-green-400 text-white border-emerald-300/50 hover:scale-105'
          }`}
        >
          {cooldown ? 'Recharging…' : 'Pet Trick ✨'}
        </button>
        <div className="text-[10px] text-white/60">
          {personality === 'wise' && '🧙 Wisdom boosts appear…'}
          {personality === 'friendly' && '😊 Teamwork makes money!'}
          {personality === 'silly' && '🤪 Wiggle wiggle bonus!'}
        </div>
        <div className="text-[10px] text-white/70">{petMessage}</div>
      </div>

      {/* Floating Hearts when happy */}
      {isHappy && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-up"
              style={{
                left: `${20 + i * 10}%`,
                bottom: '0',
                animationDuration: '2s',
                animationDelay: `${i * 0.1}s`
              }}
            >
              <Heart className="text-red-400 fill-red-400" size={16} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
