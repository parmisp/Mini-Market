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
  const fullText = "Where Kids Become Trading Pros!";
  
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
    <div className="min-h-screen bg-[#020617] relative overflow-hidden font-['Lexend']">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Coins */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-float-up opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `-50px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          >
            {i % 3 === 0 ? '💰' : i % 3 === 1 ? '💵' : '💎'}
          </div>
        ))}
      </div>
      
      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-12">
        {/* 3D Animated Owl Mascot */}
        <div className="mb-8 mt-4">
          <div className="relative w-64 h-64">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            
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
                className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-full pointer-events-none"
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
        <h1 className="text-6xl md:text-7xl font-black text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 uppercase italic tracking-tighter animate-fade-in">
          MINI MARKET
        </h1>
        
        {/* Tagline with Typing Effect */}
        <p className="text-xl md:text-2xl text-blue-300 text-center mb-8 h-10 font-medium">
          {typedText}<span className="animate-blink">|</span>
        </p>
        
        <div className="flex gap-3 mb-12">
          <div className="text-xs border border-emerald-500/50 text-emerald-400 px-4 py-2 rounded-full uppercase font-black">
            Real Market Feel
          </div>
          <div className="text-xs border border-blue-500/50 text-blue-400 px-4 py-2 rounded-full uppercase font-black">
            AI Mentor Included
          </div>
          <div className="text-xs border border-purple-500/50 text-purple-400 px-4 py-2 rounded-full uppercase font-black">
            100% Safe
          </div>
        </div>
        
        {/* CTA Button */}
        <button
          onClick={onStart}
          className="group bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-xl px-16 py-6 rounded-[2rem] uppercase tracking-widest shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 animate-pulse-slow"
        >
          <span className="flex items-center gap-3">
            Start Trading
            <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
          </span>
        </button>
        
        {/* Features Section - Below fold */}
        <div className="mt-32 mb-16 w-full max-w-5xl">
          <h3 className="text-3xl font-black text-center text-white mb-12 uppercase tracking-wide">
            Why Kids Love Trading
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
        <div className="inline-block bg-gradient-to-r from-yellow-500 to-amber-400 text-slate-900 font-black px-6 py-3 rounded-full shadow-lg">
          <Sparkles className="inline mr-2" size={20} />
          Featured in: ELLEHacks 2025 🏆
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
