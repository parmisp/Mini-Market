import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 font-['Nunito']">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border-2 border-slate-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">🦉</div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 uppercase tracking-tighter">
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
                className="w-full bg-slate-700/50 text-white text-lg font-bold px-6 py-4 rounded-xl border-2 border-slate-600 focus:border-emerald-400 focus:outline-none transition-all"
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
                className="w-full bg-slate-700/50 text-white text-lg font-bold px-6 py-4 rounded-xl border-2 border-slate-600 focus:border-emerald-400 focus:outline-none transition-all"
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
              className={`w-full font-black py-4 px-6 rounded-xl transition-all ${
                loading
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-white shadow-[0_4px_0_0_rgba(22,163,74,1)] hover:shadow-[0_2px_0_0_rgba(22,163,74,1)] hover:translate-y-1'
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
