import React, { useState, Suspense, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, useGLTF } from '@react-three/drei';

function Diamond() {
  const diamondRef = useRef();
  const { scene } = useGLTF('/dimond.glb');

  useFrame((state) => {
    if (diamondRef.current) {
      diamondRef.current.rotation.y += 0.005;
      diamondRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <primitive
      ref={diamondRef}
      object={scene}
      scale={2}
      position={[0, 0, 0]}
    />
  );
}

function DiamondModel() {
  return (
    <div className="absolute inset-0 opacity-30 pointer-events-none">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#667eea" />
          <Environment preset="city" />
          <Diamond />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/dimond.glb');

function AuthScreen({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      onAuthSuccess();
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-['Nunito'] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[520px] h-[520px] bg-emerald-500/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <div className="absolute inset-0 z-0">
        <DiamondModel />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[28px] p-8 border border-slate-800/80 shadow-[0_30px_80px_rgba(6,10,25,0.7)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🦉</div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              MINI MARKET
            </h1>
            <p className="text-slate-400 mt-2">
              {isSignUp ? 'Create your trading account' : 'Welcome back, trader!'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full bg-slate-800/70 text-white text-lg font-semibold px-5 py-4 rounded-2xl border border-slate-700 focus:border-emerald-400 focus:outline-none transition-all"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full bg-slate-800/70 text-white text-lg font-semibold px-5 py-4 rounded-2xl border border-slate-700 focus:border-emerald-400 focus:outline-none transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-black py-4 px-6 rounded-2xl transition-all ${
                loading
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_18px_40px_rgba(16,185,129,0.25)]'
              }`}
            >
              {loading ? 'Loading...' : isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-slate-400 hover:text-white transition"
            >
              {isSignUp ? (
                <>Already have an account? <span className="text-emerald-400 font-bold">Sign In</span></>
              ) : (
                <>Don't have an account? <span className="text-emerald-400 font-bold">Sign Up</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;
