import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthScreen from './components/AuthScreen';
import LandingPage from './components/LandingPage';
import AccountSetup from './components/AccountSetup';
import Dashboard from './components/Dashboard';

function App() {
  const { currentUser, userData, loading, saveUserProfile } = useAuth();
  const [screen, setScreen] = useState('loading');
  const [localUserData, setLocalUserData] = useState(null);
  const [showTransition, setShowTransition] = useState(false);
  const [hasStartedAuth, setHasStartedAuth] = useState(false);

  // Determine which screen to show based on auth state
  useEffect(() => {
    if (loading) {
      setScreen('loading');
      return;
    }

    if (!currentUser) {
      setLocalUserData(null);
      setScreen(hasStartedAuth ? 'auth' : 'landing');
      return;
    }

    // User is logged in - check if they have profile data
    if (userData && userData.name) {
      // User has completed setup before - go directly to dashboard
      setLocalUserData(userData);
      setScreen('dashboard');
    } else {
      // New user - show onboarding
      setScreen('landing');
    }
  }, [loading, currentUser, userData]);

  // Update localUserData when userData changes (e.g., after buy/sell)
  useEffect(() => {
    if (userData) {
      setLocalUserData(userData);
    }
  }, [userData]);

  const handleAuthSuccess = () => {
    // Auth state change will be handled by onAuthStateChanged in AuthContext
    // which will load user data and trigger the useEffect above
    // No need to do anything here - just let the effect handle it
  };

  const handleStart = () => {
    setHasStartedAuth(true);
    setScreen('auth');
  };

  const handleSetupComplete = async (data) => {
    // Save profile to Firestore
    await saveUserProfile(data);
    setLocalUserData({
      ...data,
      balance: 100,
      portfolio: {}
    });
    setShowTransition(true);

    // Epic transition animation
    setTimeout(() => {
      setScreen('dashboard');
      setShowTransition(false);
    }, 3000);
  };

  // Loading screen
  if (screen === 'loading') {
    return (
      <div className="dark min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">🦉</div>
          <p className="text-white text-xl font-bold">Loading...</p>
        </div>
      </div>
    );
  }

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
                {localUserData?.name}!
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
      {screen === 'auth' && <AuthScreen onAuthSuccess={handleAuthSuccess} />}
      {screen === 'landing' && <LandingPage onStart={handleStart} />}
      {screen === 'setup' && <AccountSetup onComplete={handleSetupComplete} />}
      {screen === 'dashboard' && <Dashboard userData={localUserData} />}
    </div>
  );
}

export default App;
