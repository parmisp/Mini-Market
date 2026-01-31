import React, { useState, useEffect } from 'react';
import { Wallet, RefreshCw, HelpCircle, Settings } from 'lucide-react';
import StockCard from './StockCard';
import GoalTracker from './GoalTracker';
import Confetti from './Confetti';
import AchievementModal from './AchievementModal';
import TutorialModal from './TutorialModal';
import InteractiveTutorial from './InteractiveTutorial';
import SettingsDropdown from './SettingsDropdown';
import StockyChatbot from './StockyChatbot';
import TradeHistory from './TradeHistory';
import BeginnerTooltip from './BeginnerTooltip';
import { getStockPrices, buyStock, sellStock } from '../utils/api';

function Dashboard({ userData }) {
  const [stocks, setStocks] = useState([]);
  const [balance, setBalance] = useState(100);
  const [portfolio, setPortfolio] = useState({});
  const [tradeHistory, setTradeHistory] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastBalance, setLastBalance] = useState(100);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showInteractiveTutorial, setShowInteractiveTutorial] = useState(true); // Show on first load
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    soundEnabled: true,
    theme: 'space',
    petPersonality: 'friendly',
    difficulty: 'medium'
  });
  
  const GOAL = userData?.goalAmount || 200;
  const MILESTONES = [25, 50, 75, 100, 150, 200];
  
  // Define fetchPrices first
  const fetchPrices = async () => {
    setIsRefreshing(true);
    try {
      const data = await getStockPrices();
      setStocks(data.stocks || data);
    } catch (error) {
      console.error('Failed to fetch prices:', error);
    }
    setIsRefreshing(false);
  };

  const triggerAchievement = (amount) => {
    const achievements = {
      25: { title: "First Steps!", emoji: "🎉", xp: 50, description: "You made your first $25!" },
      50: { title: "Getting Started!", emoji: "🚀", xp: 100, description: "Halfway to your first $100!" },
      75: { title: "Money Maker!", emoji: "💰", xp: 150, description: "You're on fire! Keep going!" },
      100: { title: "Doubled Up!", emoji: "🎯", xp: 250, description: "You doubled your starting money!" },
      150: { title: "Expert Trader!", emoji: "📈", xp: 400, description: "Almost at your goal!" },
      200: { title: "GOAL ACHIEVED!", emoji: "🏆", xp: 1000, description: "You reached $200! You're a trading master!" }
    };
    
    setCurrentAchievement(achievements[amount]);
    setShowAchievement(true);
    setUnlockedAchievements(prev => [...prev, amount]);
  };
  
  // Fetch stock prices on mount and every X seconds (based on difficulty)
  useEffect(() => {
    // Beginner: 20 seconds (slower, easier to react)
    // Intermediate: 15 seconds (balanced)
    // Expert: 10 seconds (faster, more challenging)
    const updateInterval = userData?.experience === 'beginner' ? 20000 : 
                          userData?.experience === 'expert' ? 10000 : 
                          15000;
    
    fetchPrices();
    const interval = setInterval(fetchPrices, updateInterval);
    return () => clearInterval(interval);
  }, [userData?.experience]);
  
  // Check for achievements
  useEffect(() => {
    if (balance >= GOAL && lastBalance < GOAL) {
      setShowConfetti(true);
      triggerAchievement(GOAL);
    }
    
    // Check for milestone achievements
    for (const milestone of MILESTONES) {
      if (balance >= milestone && lastBalance < milestone && !unlockedAchievements.includes(milestone)) {
        triggerAchievement(milestone);
        break; // Only trigger one at a time
      }
    }
  }, [balance]);
  
  useEffect(() => {
    setLastBalance(balance);
  }, [balance]);
  
  const handleBuy = async (stockId) => {
    const stock = stocks.find(s => s.id === stockId);
    
    if (balance < stock.price) {
      return;
    }
    
    try {
      // Update locally first for instant feedback
      const newBalance = balance - stock.price;
      setBalance(newBalance);
      setPortfolio({
        ...portfolio,
        [stockId]: (portfolio[stockId] || 0) + 1
      });
      
      // Add to history
      setTradeHistory(prev => [{
        type: 'BUY',
        name: stock.name,
        emoji: stock.emoji,
        price: stock.price,
        time: new Date().toLocaleTimeString()
      }, ...prev]);
      
      // Call backend
      await buyStock(stockId);
    } catch (error) {
      console.error('Buy failed:', error);
      // Revert on error
      setBalance(balance);
    }
  };
  
  const handleSell = async (stockId) => {
    const stock = stocks.find(s => s.id === stockId);
    const owned = portfolio[stockId] || 0;
    
    if (owned === 0) {
      return;
    }
    
    try {
      // Update locally
      const newBalance = balance + stock.price;
      const profit = stock.price - (stock.initialPrice || stock.price);
      
      setBalance(newBalance);
      setPortfolio({
        ...portfolio,
        [stockId]: owned - 1
      });
      
      // Add to history
      setTradeHistory(prev => [{
        type: 'SELL',
        name: stock.name,
        emoji: stock.emoji,
        price: stock.price,
        profit: profit,
        time: new Date().toLocaleTimeString()
      }, ...prev]);
      
      // Call backend
      await sellStock(stockId);
    } catch (error) {
      console.error('Sell failed:', error);
      setBalance(balance);
    }
  };
  
  const totalPortfolioValue = stocks.reduce((sum, stock) => {
    const owned = portfolio[stock.id] || 0;
    return sum + (owned * stock.price);
  }, 0);
  
  const netWorth = balance + totalPortfolioValue;
  
  return (
    <div className="min-h-screen bg-[#020617] font-['Lexend'] text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#020617]/90 backdrop-blur-xl border-b border-white/10 p-6 shadow-2xl">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div>
              <h1 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 uppercase tracking-tighter leading-none">
                MINI MARKET
              </h1>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setShowTutorial(true)}
                  className="text-[10px] border border-blue-500/50 text-blue-400 px-3 py-1 rounded-full uppercase font-bold hover:bg-blue-500/10 transition"
                >
                  Rules
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-[10px] border border-emerald-500/50 text-emerald-400 px-3 py-1 rounded-full uppercase font-bold hover:bg-emerald-500/10 transition"
                >
                  Edit Goal ⚙️
                </button>
              </div>
            </div>
            
            <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
            
            <div className="flex flex-col min-w-[300px]">
              <div className="flex justify-between text-[11px] mb-2 font-black uppercase tracking-widest text-slate-400">
                <span>Target: <span className="text-white">{userData?.goalAmount ? `$${userData.goalAmount}` : '$200'}</span></span>
                <span className="text-emerald-400">{Math.floor((netWorth / GOAL) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full p-[2px] border border-white/10">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  style={{ width: `${Math.min((netWorth / GOAL) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel px-10 py-5 rounded-[2rem] border-l-8 border-emerald-500 shadow-xl scale-110 flex items-center gap-3">
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Portfolio Value</p>
              <h2 className="text-4xl font-black text-white tracking-tight">${netWorth.toFixed(2)}</h2>
              <p className="text-slate-400 text-[9px] mt-1">Cash: ${balance.toFixed(2)}</p>
            </div>
            {userData?.experience === 'beginner' && (
              <BeginnerTooltip text="This is your total wealth: cash + the value of all your stocks. Your goal is to grow this number!" position="left" />
            )}
          </div>
        </div>
      </header>
      
      {/* Settings Dropdown */}
      <SettingsDropdown
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        userData={userData}
        onUpdateSettings={setSettings}
      />
      
      {/* Confetti celebration */}
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      
      {/* Achievement Modal */}
      {showAchievement && currentAchievement && (
        <AchievementModal
          achievement={currentAchievement}
          onClose={() => setShowAchievement(false)}
        />
      )}
      
      {/* Tutorial Modal */}
      {showTutorial && (
        <TutorialModal onClose={() => setShowTutorial(false)} />
      )}
      
      {/* Main Layout with Side Panel */}
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-140px)]">
        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {stocks.map(stock => (
              <StockCard
                key={stock.id}
                stock={stock}
                owned={portfolio[stock.id] || 0}
                canAfford={balance >= stock.price}
                onBuy={handleBuy}
                onSell={handleSell}
              />
            ))}
          </div>
          
          {stocks.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-400 text-xl">Loading stocks...</p>
            </div>
          )}
        </main>
        
        {/* Trade History Sidebar */}
        <TradeHistory history={tradeHistory} />
      </div>
      
      {/* Stocky Chatbot */}
      <StockyChatbot 
        stocks={stocks}
        balance={balance}
        userData={userData}
        portfolio={portfolio}
      />

      {/* Interactive Tutorial */}
      {showInteractiveTutorial && (
        <InteractiveTutorial 
          experience={userData?.experience || 'beginner'}
          onComplete={() => setShowInteractiveTutorial(false)}
          onClose={() => setShowInteractiveTutorial(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;