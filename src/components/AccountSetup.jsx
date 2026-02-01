import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Zap, BookOpen } from 'lucide-react';
import { getPetPower, getPowerHint } from '../utils/petPowers';
import PetPowerBook from './PetPowerBook';

function AccountSetup({ onComplete }) {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    age: null,
    goalAmount: 200,
    petName: 'Penny',
    experience: 'beginner'
  });
  const [petAnimation, setPetAnimation] = useState('normal');
  const [showPowerBook, setShowPowerBook] = useState(false);
  
  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;
  
  // Pet appearance based on age
  const getPetStyle = () => {
    if (!userData.age) return '🦉';
    if (userData.age <= 12) return '🐥'; // Young owl
    if (userData.age <= 16) return '🦉'; // Teen owl
    return '🦅'; // Adult owl
  };
  
  const getPetAccessory = () => {
    if (userData.petName.toLowerCase() === 'warren') return '👓';
    if (userData.experience === 'beginner') return '📚';
    if (userData.experience === 'intermediate') return '🧮';
    if (userData.experience === 'expert') return '💼';
    return '';
  };
  
  const handleNext = () => {
    if (step < totalSteps) {
      setPetAnimation('jump');
      setTimeout(() => setPetAnimation('normal'), 500);
      setStep(step + 1);
    } else {
      // Epic transition!
      onComplete(userData);
    }
  };
  
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  
  const canProceed = () => {
    switch(step) {
      case 1: return userData.name.length > 0;
      case 2: return userData.age !== null;
      case 3: return userData.goalAmount > 0;
      case 4: return userData.petName.length > 0;
      case 5: return userData.experience !== '';
      default: return false;
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-['Nunito']">
      <div className="w-full max-w-6xl grid md:grid-cols-5 gap-8">
        
        {/* LEFT SIDE - Live Preview */}
        <div className="md:col-span-2 bg-slate-900/80 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden border border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          
          <div className="relative z-10 text-center">
            {/* Pet Display */}
            <div className={`text-9xl mb-6 transition-all duration-500 ${petAnimation === 'jump' ? 'animate-bounce' : ''} ${userData.petName.toLowerCase() === 'penny' ? 'animate-pulse' : ''}`}>
              <div className="relative inline-block">
                {getPetStyle()}
                {getPetAccessory() && (
                  <div className="absolute -top-4 -right-4 text-4xl">{getPetAccessory()}</div>
                )}
              </div>
            </div>
            
            {/* Name Badge */}
            {userData.name && (
              <div className="bg-yellow-400 text-slate-900 px-6 py-3 rounded-full font-black text-xl mb-4 shadow-lg animate-slide-in">
                Trader {userData.name}
              </div>
            )}
            
            {/* Pet Name */}
            {userData.petName && userData.petName !== 'Penny' && (
              <div className="text-white text-2xl font-bold mb-4 animate-slide-in">
                🏷️ {userData.petName}
              </div>
            )}
            
            {/* Goal Display */}
            {userData.goalAmount && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4 animate-slide-in">
                <div className="text-emerald-400 text-3xl font-black">${userData.goalAmount}</div>
                <div className="text-white/70 text-sm">Your Goal</div>
              </div>
            )}
            
            {/* Age Display */}
            {userData.age && (
              <div className="text-white/50 text-sm">Age {userData.age}</div>
            )}
          </div>
        </div>
        
        {/* RIGHT SIDE - Form Steps */}
        <div className="md:col-span-3 bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-800 shadow-[0_12px_40px_rgba(15,23,42,0.6)]">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/60 text-sm font-bold">Progress</span>
              <span className="text-white font-black">{Math.round(progress)}% Complete</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-emerald-500 to-green-400 transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-indigo-400 font-bold mt-2">
              Step {step} of {totalSteps}
            </div>
          </div>
          
          {/* Step Content */}
          <div className="min-h-100">
            
            {/* STEP 1: Name */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-4xl font-black text-white mb-4">👋 Welcome, Future Trader!</h2>
                <p className="text-white/70 text-lg mb-8">What should we call you?</p>
                
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  placeholder="Enter your name..."
                  className="w-full bg-slate-700/50 text-white text-2xl font-bold px-6 py-4 rounded-xl border-2 border-slate-600 focus:border-emerald-400 focus:outline-none transition-all mb-4"
                  autoFocus
                />
                
                <p className="text-white/50 text-sm">This will be your trader name!</p>
              </div>
            )}
            
            {/* STEP 2: Age */}
            {/* STEP 2: Age Selection with Dropdown */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-4xl font-black text-white mb-4">🎂 How Old Are You?</h2>
                <p className="text-white/70 text-lg mb-8">We'll customize lessons for your age!</p>
                
                <div className="max-w-md mx-auto">
                  <select
                    value={userData.age || ''}
                    onChange={(e) => setUserData({...userData, age: parseInt(e.target.value)})}
                    className="w-full p-6 text-2xl font-black rounded-2xl bg-slate-800 text-white border-4 border-slate-600 focus:border-emerald-500 focus:outline-none transition-all cursor-pointer hover:border-emerald-400"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1.5rem',
                      appearance: 'none'
                    }}
                  >
                    <option value="" disabled>Select your age...</option>
                    {Array.from({ length: 8 }, (_, i) => i + 11).map(age => (
                      <option key={age} value={age}>
                        {age === 18 ? '18+' : `${age} years old`}
                      </option>
                    ))}
                  </select>
                  
                  {userData.age && (
                    <div className="mt-6 p-4 bg-emerald-500/20 border-2 border-emerald-500 rounded-2xl animate-fade-in">
                      <p className="text-emerald-300 font-bold text-center">
                        {userData.age <= 12 ? '🎈 Perfect! We\'ll keep things simple and fun!' :
                         userData.age <= 14 ? '🚀 Great! You\'ll get more advanced lessons!' :
                         '💼 Excellent! Ready for pro-level challenges!'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* STEP 3: Customizable Goal */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-4xl font-black text-white mb-4">🎯 Set Your Target!</h2>
                <p className="text-white/70 text-lg mb-8">How much money do you want to make?</p>
                
                <div className="space-y-4 mb-6">
                  {[
                    { amount: 150, label: 'EASY MODE', desc: 'Perfect for beginners!', icon: '🌟' },
                    { amount: 200, label: 'STANDARD', desc: 'Most popular choice!', icon: '⭐' },
                    { amount: 300, label: 'EXPERT', desc: 'For ambitious traders!', icon: '💎' }
                  ].map(option => (
                    <button
                      key={option.amount}
                      onClick={() => setUserData({...userData, goalAmount: option.amount})}
                      className={`w-full p-6 rounded-2xl text-left transition-all transform hover:scale-105 ${
                        userData.goalAmount === option.amount
                          ? 'bg-linear-to-r from-emerald-500 to-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                          : 'bg-slate-700 text-white hover:bg-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-black mb-1">{option.icon} {option.label}</div>
                          <div className="text-3xl font-black mb-1">Save ${option.amount}</div>
                          <div className="text-sm opacity-80">{option.desc}</div>
                        </div>
                        {userData.goalAmount === option.amount && (
                          <div className="text-4xl">✓</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Custom Goal Input */}
                <div className="mt-8 p-6 bg-slate-800 rounded-2xl border-2 border-slate-600">
                  <label className="text-white font-bold text-lg mb-3 block">💡 Or Set Your Own Goal:</label>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-emerald-400">$</span>
                    <input
                      type="number"
                      min="100"
                      max="1000"
                      value={userData.goalAmount}
                      onChange={(e) => setUserData({...userData, goalAmount: parseInt(e.target.value) || 200})}
                      className="flex-1 p-4 text-2xl font-black rounded-xl bg-slate-700 text-white border-2 border-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-slate-400 text-sm mt-3">Enter any amount between $100 - $1000</p>
                </div>
              </div>
            )}
            
            {/* STEP 4: Pet Name */}
            {step === 4 && (
              <div className="animate-fade-in">
                <h2 className="text-4xl font-black text-white mb-4">🦉 Name Your AI Pet!</h2>
                <p className="text-white/70 text-lg mb-6">Your pet is your teammate. Names unlock powers & easter eggs!</p>
                
                <input
                  type="text"
                  value={userData.petName}
                  onChange={(e) => setUserData({...userData, petName: e.target.value})}
                  placeholder="Type a name..."
                  className="w-full bg-slate-700/50 text-white text-2xl font-bold px-6 py-4 rounded-xl border-2 border-slate-600 focus:border-purple-400 focus:outline-none transition-all mb-4"
                />

                <button
                  onClick={() => setShowPowerBook(true)}
                  className="mb-4 w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen size={18} /> Open the Pet Power Book
                </button>
                
                {/* Show Power if Detected */}
                {getPetPower(userData.petName) && (
                  <div className="mb-4 animate-fade-in">
                    <div className="glass-panel p-6 rounded-2xl border-4 border-yellow-400 bg-linear-to-r from-yellow-900/50 to-orange-900/50">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">{getPetPower(userData.petName).emoji}</span>
                        <div>
                          <div className="text-yellow-300 font-black text-xl flex items-center gap-2">
                            <Zap className="text-yellow-400" />
                            SPECIAL POWER UNLOCKED!
                          </div>
                          <div className="text-lg text-white font-bold">{getPetPower(userData.petName).name}</div>
                        </div>
                      </div>
                      <div className="text-yellow-200 text-sm bg-black/30 p-3 rounded-lg">
                        {getPetPower(userData.petName).effect}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 mb-4">
                  <p className="text-purple-300 text-sm mb-2">💡 Try: Lucky, Diamond, Rocket, Dragon, Wizard, Phoenix!</p>
                  <p className="text-purple-400 text-xs">Or famous names: Warren, Buffett, Elon, Musk! Psst… there’s a secret name 👀</p>
                </div>
                
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-xl p-4 animate-pulse">
                  <p className="text-yellow-300 text-sm flex items-center gap-2">
                    <Sparkles size={16} className="animate-spin" />
                    {getPowerHint()}
                  </p>
                </div>
              </div>
            )}
            
            {/* STEP 5: Experience */}
            {step === 5 && (
              <div className="animate-fade-in">
                <h2 className="text-4xl font-black text-white mb-4">📚 Experience Level</h2>
                <p className="text-white/70 text-lg mb-8">How much do you know about money?</p>
                
                <div className="space-y-4">
                  {[
                    { value: 'beginner', icon: '🐣', label: 'BEGINNER', desc: '"This is my first time!"', feature: 'Full tutorial from square 1' },
                    { value: 'intermediate', icon: '🦅', label: 'INTERMEDIATE', desc: '"I know some basics!"', feature: 'Quick knowledge quiz' },
                    { value: 'expert', icon: '🚀', label: 'EXPERT', desc: '"I\'m ready for a challenge!"', feature: 'Harder goals & faster markets' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setUserData({...userData, experience: option.value})}
                      className={`w-full p-6 rounded-2xl text-left transition-all transform hover:scale-105 ${
                        userData.experience === option.value
                          ? 'bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]'
                          : 'bg-slate-700 text-white hover:bg-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-black mb-1">{option.icon} {option.label}</div>
                          <div className="text-lg mb-1">{option.desc}</div>
                          <div className="text-sm opacity-80">→ {option.feature}</div>
                        </div>
                        {userData.experience === option.value && (
                          <div className="text-4xl">✓</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft size={24} />
                BACK
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex-1 font-black py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 ${
                canProceed()
                  ? 'bg-linear-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-white shadow-[0_4px_0_0_rgba(22,163,74,1)] hover:shadow-[0_2px_0_0_rgba(22,163,74,1)] hover:translate-y-1'
                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
              }`}
            >
              {step === totalSteps ? 'START TRADING! 🎉' : 'NEXT'}
              {step < totalSteps && <ChevronRight size={24} />}
            </button>
          </div>
        </div>
      </div>

      <PetPowerBook
        isOpen={showPowerBook}
        onClose={() => setShowPowerBook(false)}
        currentName={userData.petName}
      />
    </div>
  );
}

export default AccountSetup;
