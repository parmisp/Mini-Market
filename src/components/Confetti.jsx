import React, { useEffect, useState } from 'react';

const Confetti = ({ onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate confetti particles
    const newParticles = [];
    const types = ['💰', '💵', '🏆', '✨', '⭐', '💎', '🌟'];
    
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        left: Math.random() * 100,
        animationDelay: Math.random() * 0.5,
        animationDuration: 2 + Math.random() * 1,
        rotation: Math.random() * 360,
        size: 1 + Math.random() * 1.5
      });
    }
    
    setParticles(newParticles);

    // Auto-cleanup after animation
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${particle.left}%`,
            top: '-10%',
            fontSize: `${particle.size}rem`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
            transform: `rotate(${particle.rotation}deg)`,
          }}
        >
          {particle.type}
        </div>
      ))}
      
      {/* Golden glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-yellow-400/20 via-transparent to-transparent animate-pulse" />
    </div>
  );
};

export default Confetti;
