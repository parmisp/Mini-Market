import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Check, TrendingUp, TrendingDown, DollarSign, Palette, Settings } from 'lucide-react';
import StockChart from './StockChart';

export default function InteractiveTutorial({
  experience,
  onComplete,
  onClose,
  onOpenSettings,
  onPreviewTheme
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showingFeedback, setShowingFeedback] = useState(null);
  const [actionsDone, setActionsDone] = useState({});
  const [practiceBalance, setPracticeBalance] = useState(50);
  const [practicePortfolio, setPracticePortfolio] = useState({});
  const [practiceStocks, setPracticeStocks] = useState([
    {
      id: 'p1',
      name: 'SnackWave',
      emoji: '🍿',
      price: 8.5,
      trend: 'down',
      history: [10, 9.8, 9.4, 9.2, 8.9, 8.7, 8.5]
    },
    {
      id: 'p2',
      name: 'GameQuest',
      emoji: '🎮',
      price: 12.2,
      trend: 'up',
      history: [10.8, 11.1, 11.6, 11.9, 12.0, 12.1, 12.2]
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPracticeStocks((prev) =>
        prev.map((stock) => {
          const change = (Math.random() - 0.5) * 0.6;
          const newPrice = Math.max(5, stock.price + change);
          const trend = newPrice > stock.price ? 'up' : newPrice < stock.price ? 'down' : stock.trend;
          const newHistory = [...stock.history, newPrice].slice(-12);
          return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),
            trend,
            history: newHistory
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const beginnerSteps = [
    {
      title: 'Welcome to the Trading Arcade!',
      icon: '🎮',
      content: 'You’re about to level up your money skills with quick challenges and power-ups.',
      actionType: null,
      position: 'center'
    },
    {
      title: 'Buy Low Challenge',
      icon: '🛒',
      content: 'Which stock would you buy right now?',
      actionType: 'trade',
      position: 'center'
    },
    {
      title: 'Trial Run',
      icon: '🧪',
      content: 'Try a safe practice trade. Pick the best move!',
      actionType: 'trial',
      position: 'bottom-right'
    },
    {
      title: 'Meet Your Pet',
      icon: '🦉',
      content: 'Give your pet a high‑five to charge a power spark.',
      actionType: 'pet',
      position: 'bottom-right'
    },
    {
      title: 'Chatbot Corner',
      icon: '💬',
      content: 'Bottom-right is Stocky the chatbot. Ask questions anytime!',
      actionType: null,
      position: 'bottom-right'
    },
    {
      title: 'Settings Superpower',
      icon: '⚙️',
      content: 'Open Settings to adjust your goal, theme, personality, and difficulty.',
      actionType: 'settings',
      position: 'top-right'
    },
    {
      title: 'Pick Your Theme',
      icon: '🎨',
      content: 'Choose a vibe you love. Themes actually change your world now.',
      actionType: 'theme',
      position: 'top-right'
    },
    {
      title: 'You’re Ready!',
      icon: '🚀',
      content: 'Buy low, sell high, and ask Stocky for tips anytime. Let’s trade!',
      actionType: null,
      position: 'center'
    }
  ];

  const intermediateSteps = [
    {
      title: 'Quick Knowledge Check',
      icon: '🧠',
      content: 'Answer these to unlock the trading floor.',
      question: null
    },
    {
      title: 'Question 1',
      icon: '❓',
      content: 'When should you BUY a stock?',
      question: {
        id: 'q1',
        options: [
          { text: 'When the price is HIGH', correct: false, feedback: 'Not quite! Buy low for better value.' },
          { text: 'When the price is LOW', correct: true, feedback: 'Correct! Buy low, sell high!' },
          { text: 'When it’s your favorite company', correct: false, feedback: 'Good idea, but price matters most.' },
          { text: 'Whenever you want', correct: false, feedback: 'Timing matters!' }
        ]
      }
    },
    {
      title: 'Question 2',
      icon: '❓',
      content: 'What does a ↓ DOWN arrow mean?',
      question: {
        id: 'q2',
        options: [
          { text: 'The stock is doing great!', correct: false, feedback: 'DOWN means the price is falling.' },
          { text: 'The stock price is dropping', correct: true, feedback: 'Exactly! That can be a good buy time.' },
          { text: 'You should sell immediately', correct: false, feedback: 'Not always!' },
          { text: 'The company is bankrupt', correct: false, feedback: 'Nope, prices move all the time.' }
        ]
      }
    },
    {
      title: 'Question 3',
      icon: '❓',
      content: 'How do you make profit?',
      question: {
        id: 'q3',
        options: [
          { text: 'Buy at any price, hold forever', correct: false, feedback: 'You need to sell at the right time!' },
          { text: 'Buy low, sell high', correct: true, feedback: 'Perfect!' },
          { text: 'Buy high, sell low', correct: false, feedback: 'That loses money.' },
          { text: 'Only buy expensive stocks', correct: false, feedback: 'Price doesn’t mean quality.' }
        ]
      }
    },
    {
      title: 'All Set!',
      icon: '✅',
      content: 'You’re good to go. Remember: watch trends and use your pet powers.',
      question: null
    }
  ];

  const expertSteps = [
    {
      title: 'Welcome Back, Pro!',
      icon: '🚀',
      content: 'Faster prices, bigger swings, tougher goals. Ready?',
      question: null
    },
    {
      title: 'Expert Mode Activated',
      icon: '⚡',
      content: 'Markets are volatile. Use Trade History and pet powers to stay sharp.',
      question: null
    }
  ];

  const steps = experience === 'beginner' ? beginnerSteps : experience === 'intermediate' ? intermediateSteps : expertSteps;
  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const completeAction = (actionType) => {
    setActionsDone((prev) => ({ ...prev, [actionType]: true }));
  };

  const handleAnswer = (questionId, optionIndex, option) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: optionIndex });
    setShowingFeedback({ correct: option.correct, message: option.feedback });

    if (option.correct) {
      setTimeout(() => {
        setShowingFeedback(null);
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const renderAction = () => {
    switch (currentStepData.actionType) {
      case 'trade':
        return (
          <div className="mt-6 grid gap-3">
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700">
              <div className="text-white text-lg font-black mb-1">🍕 FoodStock</div>
              <div className="text-white/70 text-sm mb-3">Price is DOWN (cheap now!)</div>
              <div className="flex gap-3">
                <button
                  onClick={() => completeAction('trade')}
                  className="flex-1 bg-emerald-500/20 border border-emerald-400 text-emerald-200 py-3 rounded-xl font-black"
                >
                  Buy the dip ✅
                </button>
                <button
                  onClick={() => setShowingFeedback({ correct: false, message: 'Try buying when it’s DOWN!' })}
                  className="flex-1 bg-red-500/10 border border-red-400 text-red-200 py-3 rounded-xl font-black"
                >
                  Skip it ❌
                </button>
              </div>
            </div>
          </div>
        );
      case 'pet':
        return (
          <div className="mt-6">
            <button
              onClick={() => completeAction('pet')}
              className="w-full bg-linear-to-r from-purple-500 to-indigo-500 text-white font-black py-4 rounded-2xl shadow-lg"
            >
              High‑five Stocky ✋🦉
            </button>
          </div>
        );
      case 'trial':
        return (
          <div className="mt-6 bg-slate-800/60 rounded-2xl p-4 border border-slate-700">
            <div className="text-sm text-white/70 mb-3">Practice round: buy low, sell high.</div>
            <div className="flex items-center justify-between text-xs text-white/70 mb-3">
              <span>Practice Cash: ${practiceBalance.toFixed(2)}</span>
              <span>Try a BUY + SELL to finish</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {practiceStocks.map((stock) => {
                const owned = practicePortfolio[stock.id] || 0;
                return (
                  <div key={stock.id} className="rounded-2xl border border-white/10 p-3 bg-slate-900/40">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-lg font-black text-white">{stock.emoji} {stock.name}</div>
                      <div className={`text-[10px] font-black ${stock.trend === 'down' ? 'text-red-300' : 'text-emerald-300'}`}>
                        {stock.trend.toUpperCase()}
                      </div>
                    </div>
                    <StockChart history={stock.history} trend={stock.trend} />
                    <div className="mt-2 text-white font-black">${stock.price.toFixed(2)}</div>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => {
                          if (practiceBalance < stock.price) return;
                          setPracticeBalance((prev) => prev - stock.price);
                          setPracticePortfolio((prev) => ({ ...prev, [stock.id]: (prev[stock.id] || 0) + 1 }));
                        }}
                        className="flex-1 bg-emerald-500/20 border border-emerald-400 text-emerald-200 py-2 rounded-lg font-black text-xs"
                      >
                        BUY
                      </button>
                      <button
                        onClick={() => {
                          if (owned === 0) return;
                          setPracticeBalance((prev) => prev + stock.price);
                          setPracticePortfolio((prev) => ({ ...prev, [stock.id]: Math.max(0, (prev[stock.id] || 0) - 1) }));
                          completeAction('trial');
                          setShowingFeedback({ correct: true, message: 'Nice! You completed a practice trade.' });
                        }}
                        className="flex-1 bg-slate-700/60 border border-white/10 text-white/80 py-2 rounded-lg font-black text-xs"
                      >
                        SELL
                      </button>
                    </div>
                    <div className="mt-2 text-[10px] text-white/60">Owned: {owned}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="mt-6">
            <button
              onClick={() => {
                onOpenSettings?.();
                completeAction('settings');
              }}
              className="w-full bg-slate-800 border border-slate-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              <Settings size={18} /> Open Settings
            </button>
          </div>
        );
      case 'theme':
        return (
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { id: 'space', label: 'Space', color: 'from-indigo-600 to-purple-600' },
              { id: 'neon', label: 'Neon', color: 'from-pink-500 to-cyan-500' },
              { id: 'ocean', label: 'Ocean', color: 'from-blue-500 to-teal-500' }
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  onPreviewTheme?.(theme.id);
                  completeAction('theme');
                }}
                className={`rounded-2xl py-4 text-white font-black bg-linear-to-br ${theme.color} border-2 border-white/10 hover:scale-105 transition`}
              >
                <Palette size={16} className="inline mr-1" /> {theme.label}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const isActionRequired = !!currentStepData.actionType;
  const isActionComplete = currentStepData.actionType ? actionsDone[currentStepData.actionType] : true;
  const positionMap = {
    'top-left': 'items-start justify-start',
    'top-right': 'items-start justify-end',
    'bottom-left': 'items-end justify-start',
    'bottom-right': 'items-end justify-end',
    center: 'items-center justify-center'
  };
  const wrapperPosition = experience === 'beginner'
    ? (positionMap[currentStepData.position] || positionMap.center)
    : positionMap.center;

  return (
    <div className={`fixed inset-0 bg-black/30 flex ${wrapperPosition} z-50 p-4 pointer-events-none`}>
      <div className="relative bg-linear-to-br from-slate-900 to-slate-800 border-2 border-purple-500/30 rounded-3xl max-w-md w-full max-h-[85vh] overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.25)] animate-fade-in pointer-events-auto">
        <div className="absolute -left-3 top-8 w-0 h-0 border-y-10 border-y-transparent border-r-12 border-r-purple-500/70" />
        <div className="bg-linear-to-r from-purple-600 to-indigo-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{currentStepData.icon}</div>
            <div>
              <h2 className="text-2xl font-black text-white">{currentStepData.title}</h2>
              <p className="text-white/70 text-sm">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>

          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div className="bg-white h-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-250px)]">
          <p className="text-white/90 text-lg mb-6 leading-relaxed">
            {currentStepData.content}
          </p>

          {currentStepData.question && (
            <div className="space-y-3">
              {currentStepData.question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentStepData.question.id, index, option)}
                  disabled={quizAnswers[currentStepData.question.id] !== undefined}
                  className={`w-full p-4 rounded-xl text-left transition-all transform hover:scale-102 ${
                    quizAnswers[currentStepData.question.id] === index
                      ? option.correct
                        ? 'bg-green-500/20 border-2 border-green-500 text-white'
                        : 'bg-red-500/20 border-2 border-red-500 text-white'
                      : 'bg-slate-700/50 border-2 border-slate-600 text-white hover:border-purple-400'
                  } ${quizAnswers[currentStepData.question.id] !== undefined ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option.text}</span>
                    {quizAnswers[currentStepData.question.id] === index && (
                      <span className="text-2xl">{option.correct ? '✅' : '❌'}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {renderAction()}

          {showingFeedback && (
            <div className={`mt-6 p-4 rounded-xl animate-fade-in ${
              showingFeedback.correct ? 'bg-green-500/20 border-2 border-green-500' : 'bg-orange-500/20 border-2 border-orange-500'
            }`}>
              <p className="text-white text-lg flex items-center gap-2">
                {showingFeedback.correct ? '🎉' : '💡'} {showingFeedback.message}
              </p>
            </div>
          )}

          {experience === 'beginner' && currentStep === 2 && (
            <div className="mt-6 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="text-sm text-white/70 space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-green-400" size={20} />
                  <span>↑ GREEN = price going UP (sell time!)</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="text-red-400" size={20} />
                  <span>↓ RED = price going DOWN (buy time!)</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="text-blue-400" size={20} />
                  <span>Current price = cost per share</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-900/50 border-t border-slate-700">
          <div className="flex justify-between items-center">
            <div className="text-white/50 text-sm">
              {experience === 'beginner' && '🎯 Complete the mini‑challenges to continue'}
              {experience === 'intermediate' && '🧠 Answer correctly to continue'}
              {experience === 'expert' && '⚡ Quick briefing for pros'}
            </div>

            {!currentStepData.question && (
              <button
                onClick={handleNext}
                disabled={isActionRequired && !isActionComplete}
                className={`px-8 py-3 rounded-xl transition-all transform flex items-center gap-2 shadow-lg ${
                  isActionRequired && !isActionComplete
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-linear-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white hover:scale-105'
                }`}
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Start Trading! <Check size={20} />
                  </>
                ) : (
                  <>
                    Next <ArrowRight size={20} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
