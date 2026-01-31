import React, { useState } from 'react';
import { X, ArrowRight, Check, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

export default function InteractiveTutorial({ experience, onComplete, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showingFeedback, setShowingFeedback] = useState(null);

  // BEGINNER: Full step-by-step tutorial
  const beginnerSteps = [
    {
      title: "Welcome to Stock Trading!",
      icon: "🎉",
      content: "You're going to learn how to grow your money by buying and selling stocks. Think of stocks like trading cards - buy them cheap, sell them for more!",
      question: null
    },
    {
      title: "What's a Stock?",
      icon: "📈",
      content: "A stock is a small piece of a company. When a company does well, its stock price goes UP. When it struggles, the price goes DOWN.",
      question: null
    },
    {
      title: "Your Starting Money",
      icon: "💵",
      content: "You start with $100. This is your virtual money to practice with. Don't worry - it's not real money, so you can't lose anything!",
      question: null
    },
    {
      title: "How to Make Money",
      icon: "💡",
      content: "The secret to making money: BUY LOW (when prices are down) → WAIT for prices to go up → SELL HIGH (when prices are up). That's it!",
      question: null
    },
    {
      title: "Reading Stock Cards",
      icon: "🎴",
      content: "Each stock card shows: Company name, Current price, Trend (↑ = Going Up, ↓ = Going Down), How many shares you own. The chart shows price history!",
      question: null
    },
    {
      title: "Making Your First Trade",
      icon: "🛒",
      content: "Look for stocks with the ↓ DOWN arrow (they're cheaper now). Click BUY to purchase one share. Then wait for the price to go up before selling!",
      question: null
    },
    {
      title: "Your Goal",
      icon: "🎯",
      content: "Your mission is to grow your $100 into your goal amount through smart buying and selling. Take your time and watch the trends!",
      question: null
    },
    {
      title: "Meet Stocky!",
      icon: "🦉",
      content: "Stocky the Owl is your guide! Click the chat bubble anytime to ask questions like 'Should I buy?' or 'How am I doing?'. Stocky will help you!",
      question: null
    }
  ];

  // INTERMEDIATE: Quick quiz to test knowledge
  const intermediateSteps = [
    {
      title: "Quick Knowledge Check",
      icon: "🧠",
      content: "Let's see what you already know! Answer these questions to unlock the trading floor.",
      question: null
    },
    {
      title: "Question 1",
      icon: "❓",
      content: "When should you BUY a stock?",
      question: {
        id: 'q1',
        options: [
          { text: "When the price is HIGH", correct: false, feedback: "Not quite! You want to buy when prices are LOW to get a better deal." },
          { text: "When the price is LOW", correct: true, feedback: "Correct! Buy low, sell high - that's the golden rule!" },
          { text: "When it's your favorite company", correct: false, feedback: "Good thinking, but price matters more than feelings in trading!" },
          { text: "Whenever you want", correct: false, feedback: "Timing matters! Buy when prices are down to maximize profit." }
        ]
      }
    },
    {
      title: "Question 2",
      icon: "❓",
      content: "What does a ↓ DOWN arrow on a stock mean?",
      question: {
        id: 'q2',
        options: [
          { text: "The stock is doing great!", correct: false, feedback: "Actually, DOWN means the price is falling." },
          { text: "The stock price is dropping", correct: true, feedback: "Exactly! And that might be a good time to buy cheap!" },
          { text: "You should sell immediately", correct: false, feedback: "Not always! If you haven't bought yet, down prices can be good deals." },
          { text: "The company is bankrupt", correct: false, feedback: "No! Prices go up and down all the time. It's normal market movement." }
        ]
      }
    },
    {
      title: "Question 3",
      icon: "❓",
      content: "How do you make profit in stock trading?",
      question: {
        id: 'q3',
        options: [
          { text: "Buy at any price, hold forever", correct: false, feedback: "You need to sell at the right time to lock in profits!" },
          { text: "Buy low, sell high", correct: true, feedback: "Perfect! That's how you turn your $100 into your goal!" },
          { text: "Buy high, sell low", correct: false, feedback: "That's backwards! You'd lose money that way." },
          { text: "Only buy expensive stocks", correct: false, feedback: "Price doesn't mean quality. Look for good value!" }
        ]
      }
    },
    {
      title: "All Set!",
      icon: "✅",
      content: "Great job! You know the basics. Remember: watch the trends, be patient, and ask Stocky for help anytime!",
      question: null
    }
  ];

  // EXPERT: Minimal guidance
  const expertSteps = [
    {
      title: "Welcome Back, Pro!",
      icon: "🚀",
      content: "You've got this! Here's the challenge: faster price changes, more stocks to track, and harder goals. Good luck!",
      question: null
    },
    {
      title: "Expert Mode Activated",
      icon: "⚡",
      content: "Prices update every 15 seconds. Markets are volatile. Your portfolio needs constant attention. Use the Trade History to track your performance!",
      question: null
    }
  ];

  const steps = experience === 'beginner' ? beginnerSteps : experience === 'intermediate' ? intermediateSteps : expertSteps;

  const handleAnswer = (questionId, optionIndex, option) => {
    setQuizAnswers({...quizAnswers, [questionId]: optionIndex});
    setShowingFeedback({ correct: option.correct, message: option.feedback });
    
    if (option.correct) {
      setTimeout(() => {
        setShowingFeedback(null);
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }, 2000);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.3)] animate-fade-in">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 relative">
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

          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-250px)]">
          <p className="text-white/90 text-lg mb-6 leading-relaxed">
            {currentStepData.content}
          </p>

          {/* Question Section */}
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
                      <span className="text-2xl">
                        {option.correct ? '✅' : '❌'}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Feedback */}
          {showingFeedback && (
            <div className={`mt-6 p-4 rounded-xl animate-fade-in ${
              showingFeedback.correct 
                ? 'bg-green-500/20 border-2 border-green-500' 
                : 'bg-orange-500/20 border-2 border-orange-500'
            }`}>
              <p className="text-white text-lg flex items-center gap-2">
                {showingFeedback.correct ? '🎉' : '💡'} {showingFeedback.message}
              </p>
            </div>
          )}

          {/* Visual Aids for Beginners */}
          {experience === 'beginner' && currentStep === 4 && (
            <div className="mt-6 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="text-sm text-white/70 space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-green-400" size={20} />
                  <span>↑ GREEN = Price going UP (good time to sell!)</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="text-red-400" size={20} />
                  <span>↓ RED = Price going DOWN (good time to buy!)</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="text-blue-400" size={20} />
                  <span>Current Price = What you'll pay per share</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900/50 border-t border-slate-700">
          <div className="flex justify-between items-center">
            <div className="text-white/50 text-sm">
              {experience === 'beginner' && '📚 Take your time learning'}
              {experience === 'intermediate' && '🧠 Answer correctly to continue'}
              {experience === 'expert' && '⚡ Quick briefing for pros'}
            </div>
            
            {!currentStepData.question && (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
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
