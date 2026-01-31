import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AccountSetup from './components/AccountSetup';
import Dashboard from './components/Dashboard';
import backgroundPattern from './assets/background-pattern.svg';

function App() {
  const [screen, setScreen] = useState('landing'); // 'landing', 'setup', 'dashboard'
  const [userData, setUserData] = useState(null);
  const [showTransition, setShowTransition] = useState(false);
  
  const handleStart = () => {
    setScreen('setup');
  };
  
  const handleSetupComplete = (data) => {
    setUserData(data);
    setShowTransition(true);
    
    // Epic transition animation
    setTimeout(() => {
      setScreen('dashboard');
      setShowTransition(false);
    }, 3000);
  };
  
  return (
    <div className="dark min-h-screen">
      {/* Epic Transition Animation */}
      {showTransition && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
          {/* Flying Owl */}
          <div className="absolute animate-[fly_3s_ease-in-out]">
            <div className="text-9xl">🦉</div>
          </div>
          
          {/* Coin Trail */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-fade-in"
              style={{
                left: `${10 + i * 5}%`,
                top: '50%',
                animationDelay: `${i * 0.1}s`,
                opacity: 0
              }}
            >
              💰
            </div>
          ))}
          
          {/* Welcome Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-fade-in" style={{ animationDelay: '1s' }}>
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 mb-4">
                WELCOME TO THE MARKET,
              </h1>
              <h2 className="text-7xl font-black text-white">
                {userData?.name}!
              </h2>
            </div>
          </div>
          
          {/* Raining Numbers */}
          {[...Array(30)].map((_, i) => (
            <div
              key={`num-${i}`}
              className="absolute text-emerald-400 font-mono text-xl animate-float-up"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${1.5 + Math.random() * 0.5}s`,
                animationDuration: '2s'
              }}
            >
              {['$', '📈', '💹', '💵'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}
      
      {/* Screen Router */}
      {screen === 'landing' && <LandingPage onStart={handleStart} />}
      {screen === 'setup' && <AccountSetup onComplete={handleSetupComplete} />}
      {screen === 'dashboard' && <Dashboard userData={userData} />}
    </div>
  );
}

export default App;