import React, { useState, useEffect, Suspense } from 'react';
import { ArrowRight, TrendingUp, Award, Sparkles } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei';

// Owl 3D Model Component
function OwlModel() {
  const { scene } = useGLTF('/owl.glb');
  
  return (
    <primitive 
      object={scene} 
      scale={2.5} 
      position={[0, -0.5, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

function LandingPage({ onStart }) {
  const [typedText, setTypedText] = useState('');
  const fullText = "Level up your money powers!";
  
  useEffect(() => {
    // Typing animation
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.substring(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="min-h-screen relative overflow-hidden text-white font-sans">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle Overlay Grid */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-violet-600/30 rounded-full mix-blend-screen blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-fuchsia-600/30 rounded-full mix-blend-screen blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-1/3 w-[30vw] h-[30vw] bg-cyan-500/20 rounded-full mix-blend-screen blur-[80px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Coins */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float-up opacity-20 blur-[1px]"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `-100px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 8}s`,
              transform: `scale(${0.5 + Math.random() * 0.5})`
            }}
          >
            {i % 3 === 0 ? '💰' : i % 3 === 1 ? '💎' : '🚀'}
          </div>
        ))}
      </div>
      
      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-12">
        {/* 3D Animated Owl Mascot */}
        <div className="mb-8 mt-4">
          <div className="relative w-64 h-64">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            
            {/* 3D Canvas for owl.glb */}
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-8 border-white/20 animate-bounce-slow shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
              }}
            >
              <Canvas>
                <Suspense fallback={null}>
                  <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                  <pointLight position={[-5, 5, 5]} intensity={0.5} color="#667eea" />
                  <pointLight position={[5, -5, -5]} intensity={0.5} color="#764ba2" />
                  <OwlModel />
                  <OrbitControls 
                    enableZoom={false} 
                    autoRotate 
                    autoRotateSpeed={2}
                    enablePan={false}
                    minPolarAngle={Math.PI / 2.5}
                    maxPolarAngle={Math.PI / 2.5}
                  />
                </Suspense>
              </Canvas>
              
              {/* 3D Glass reflection overlay */}
              <div 
                className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent rounded-full pointer-events-none"
              ></div>
            </div>
            
            {/* Sparkles around owl */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute text-3xl animate-pulse pointer-events-none"
                style={{
                  top: `${50 + 45 * Math.sin((i * Math.PI * 2) / 8)}%`,
                  left: `${50 + 45 * Math.cos((i * Math.PI * 2) / 8)}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${i * 0.2}s`
                }}
              >
                ✨
              </div>
            ))}
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-black text-center mb-2 text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-emerald-400 uppercase tracking-tight">
          MINI MARKET
        </h1>
        
        {/* Tagline with Typing Effect */}
        <p className="text-xl md:text-2xl text-blue-300 text-center mb-8 h-10 font-medium">
          {typedText}<span className="animate-blink">|</span>
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <div className="text-xs border border-emerald-500/50 text-emerald-400 px-4 py-2 rounded-full uppercase font-black">
            Real Market Feel
          </div>
          <div className="text-xs border border-blue-500/50 text-blue-400 px-4 py-2 rounded-full uppercase font-black">
            AI Mentor + Pet Powers
          </div>
          <div className="text-xs border border-purple-500/50 text-purple-400 px-4 py-2 rounded-full uppercase font-black">
            100% Safe & Fun
          </div>
          <div className="text-xs border border-yellow-500/50 text-yellow-300 px-4 py-2 rounded-full uppercase font-black">
            Arcade Missions
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <button
            onClick={onStart}
            className="group bg-linear-to-r from-emerald-600 to-emerald-500 text-white font-black text-xl px-16 py-6 rounded-4xl uppercase tracking-widest shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 animate-pulse-slow"
          >
            <span className="flex items-center gap-3">
              Start Trading
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
            </span>
          </button>
          <div className="bg-white/5 border border-white/10 rounded-4xl px-6 py-4 text-white/70 text-sm flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div className="text-left">
              <div className="font-black text-white">Pet Powers & Easter Eggs</div>
              <div className="text-xs text-white/60">Name your pet to unlock secrets</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-16">
          {[
            { label: 'Traders Joined', value: '1,200+' },
            { label: 'Pet Powers', value: '15+' },
            { label: 'Safe Practice', value: '0 Risk' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-white/60 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Features Section - Below fold */}
        <div className="mt-32 mb-16 w-full max-w-5xl">
          <h3 className="text-3xl font-black text-center text-white mb-12 uppercase tracking-wide">
            Why People Love Trading
          </h3>
        </div>
      </div>
      
      {/* Feature Cards */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group bg-white/5 backdrop-blur-md rounded-3xl p-8 border-2 border-white/10 hover:border-emerald-400/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(34,197,94,0.3)] cursor-pointer transform hover:rotate-1">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="text-2xl font-black text-white mb-2">REAL-TIME</h3>
            <h4 className="text-xl font-bold text-emerald-400 mb-3">PRICES</h4>
            <p className="text-white/70">Watch stocks change every 15 seconds!</p>
          </div>
          
          {/* Card 2 */}
          <div className="group bg-white/5 backdrop-blur-md rounded-3xl p-8 border-2 border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(168,85,247,0.3)] cursor-pointer transform hover:rotate-1" style={{ animationDelay: '0.1s' }}>
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🦉</div>
            <h3 className="text-2xl font-black text-white mb-2">AI MENTOR</h3>
            <h4 className="text-xl font-bold text-purple-400 mb-3">TEACHES YOU!</h4>
            <p className="text-white/70">Your personal trading buddy guides you!</p>
          </div>
          
          {/* Card 3 */}
          <div className="group bg-white/5 backdrop-blur-md rounded-3xl p-8 border-2 border-white/10 hover:border-yellow-400/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(251,191,36,0.3)] cursor-pointer transform hover:rotate-1" style={{ animationDelay: '0.2s' }}>
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
            <h3 className="text-2xl font-black text-white mb-2">ACHIEVE</h3>
            <h4 className="text-xl font-bold text-yellow-400 mb-3">$200 GOAL</h4>
            <p className="text-white/70">Turn $100 into $200 and win!</p>
          </div>
        </div>
      </div>
      
      {/* Bottom Badge */}
      <div className="relative z-10 text-center pb-8">
        <div className="inline-block bg-linear-to-r from-yellow-500 to-amber-400 text-slate-900 font-black px-6 py-3 rounded-full shadow-lg">
          <Sparkles className="inline mr-2" size={20} />
          Submitted to Ellehacks 2026
        </div>
      </div>
      
      {/* Scrolling Ticker */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-sm border-t-2 border-slate-700 py-2 overflow-hidden z-20">
        <div className="animate-scroll-left whitespace-nowrap text-white/60 font-mono text-sm">
          <span className="inline-block px-8">💻 TechCoin: $15.50 ↗</span>
          <span className="inline-block px-8">🍕 FoodStock: $8.25 ↘</span>
          <span className="inline-block px-8">🎮 GameShare: $12.00 ↗</span>
          <span className="inline-block px-8">💻 TechCoin: $15.50 ↗</span>
          <span className="inline-block px-8">🍕 FoodStock: $8.25 ↘</span>
          <span className="inline-block px-8">🎮 GameShare: $12.00 ↗</span>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
