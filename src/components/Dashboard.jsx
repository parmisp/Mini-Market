import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, LogOut, Trophy } from 'lucide-react';
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
import Leaderboard from './Leaderboard';
import { getStockPrices, buyStock, sellStock } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { getPetPower } from '../utils/petPowers';
import { sounds } from '../utils/sounds';

function Dashboard({ userData }) {
  const { signOut, saveGameState, saveSettings, saveTransaction, loadTransactionHistory, updateLeaderboardEntry } = useAuth();

  const [stocks, setStocks] = useState([]);
  // Initialize from userData (Firestore) or default to 100
  const [balance, setBalance] = useState(userData?.balance ?? 100);
  const [portfolio, setPortfolio] = useState(userData?.portfolio ?? {});
  const [tradeHistory, setTradeHistory] = useState([]);
  const [lastBalance, setLastBalance] = useState(100);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showInteractiveTutorial, setShowInteractiveTutorial] = useState(() => {
    return localStorage.getItem('mm_tutorial_completed') !== 'true';
  }); // Show only for first-time users
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [settings, setSettings] = useState({
    soundEnabled: userData?.settings?.soundEnabled ?? true,
    theme: userData?.theme || userData?.settings?.theme || 'space',
    petPersonality: userData?.petPersonality || userData?.settings?.petPersonality || 'friendly',
    difficulty: userData?.experience === 'expert' ? 'hard' : userData?.experience === 'intermediate' ? 'medium' : 'easy',
    goalAmount: userData?.goalAmount || userData?.settings?.goalAmount || 200
  });
  const [petPower, setPetPower] = useState(null);
  const [priceFreezeNext, setPriceFreezeNext] = useState(false);
  const [petDiscountRemaining, setPetDiscountRemaining] = useState(0);
  const [petBonusText, setPetBonusText] = useState('');
  const [stockBadges, setStockBadges] = useState({});
  const [moonshotStock, setMoonshotStock] = useState(null);
  const [xp, setXp] = useState(0);
  const [subgoals, setSubgoals] = useState([
    { id: 'first-buy', title: 'Make your first BUY', reward: 20, completed: false },
    { id: 'first-sell', title: 'Make your first SELL', reward: 30, completed: false },
    { id: 'first-profit', title: 'Sell with profit', reward: 40, completed: false },
    { id: 'pet-trick', title: 'Use a pet trick', reward: 25, completed: false },
    { id: 'open-settings', title: 'Open Settings', reward: 10, completed: false }
  ]);
  const getBuyPrice = (stock) => {
    let price = stock.price;
    if (petPower?.ability && typeof petPower.ability === 'function' && petPower.key === 'penny') {
      price = petPower.ability(price);
    }
    if (petDiscountRemaining > 0) {
      price = Math.max(1, price * 0.5);
    }
    return price;
  };

  
  const GOAL = settings.goalAmount || userData?.goalAmount || 200;
  const MILESTONES = useMemo(() => {
    const age = userData?.age;
    if (typeof age !== 'number') return [25, 50, 75, 100, 150, 200];
    if (age <= 11) return [10, 20, 30, 40, 50, 75, 100, 125, 150, 175, 200];
    if (age <= 14) return [20, 40, 60, 80, 100, 125, 150, 175, 200];
    if (age <= 17) return [25, 50, 75, 100, 150, 200];
    return [50, 100, 150, 200];
  }, [userData?.age]);
  const level = Math.floor(xp / 100) + 1;
  const levelProgress = xp % 100;
  const hasTraded = useMemo(() => {
    const ownsAnything = Object.values(portfolio).some((count) => count > 0);
    return tradeHistory.length > 0 || ownsAnything;
  }, [portfolio, tradeHistory.length]);
  
  // Initialize pet power on mount
  useEffect(() => {
    if (userData?.petName) {
      const power = getPetPower(userData.petName);
      setPetPower(power);
    }
  }, [userData?.petName]);
  
  // Define fetchPrices first
  const fetchPrices = useCallback(async () => {
    try {
      const difficulty = petPower?.ability === 'volatility-boost' ? 'hard' : settings.difficulty;
      const data = await getStockPrices(difficulty, { freeze: priceFreezeNext });
      let updated = data.stocks || data;

      if (petPower?.ability === 'always-up') {
        updated = updated.map((stock) => {
          const previous = stocks.find((s) => s.id === stock.id);
          const owned = portfolio[stock.id] || 0;
          if (owned > 0 && previous && stock.price < previous.price) {
            return { ...stock, price: previous.price, trend: 'up' };
          }
          return stock;
        });
      }

      if (petPower?.ability === 'reveal-moonshot') {
        setMoonshotStock((prev) => {
          const base = prev?.price || 18;
          const swing = (Math.random() - 0.5) * 6;
          const newPrice = Math.max(8, base + swing);
          const trend = newPrice > base ? 'up' : newPrice < base ? 'down' : 'stable';
          return {
            id: 'moonshot',
            name: 'MoonShot X',
            emoji: '🌙',
            price: parseFloat(newPrice.toFixed(2)),
            trend,
            riskLevel: 'High',
            history: [...(prev?.history || Array(10).fill(base)), newPrice].slice(-20)
          };
        });
      }

      setStocks(updated);

      if (petPower?.ability === 'hold-bonus' && hasTraded) {
        const ownedCount = Object.values(portfolio).reduce((sum, count) => sum + count, 0);
        if (ownedCount > 0) {
          setBalance((prev) => prev + ownedCount * 1);
          setPetBonusText(`💎 Diamond bonus: +$${ownedCount}`);
        }
      }

      if (petPower?.ability === 'random-bonus' && hasTraded && Math.random() < 0.25) {
        setBalance((prev) => prev + 5);
        setPetBonusText('🍀 Lucky Charm: +$5 bonus!');
      }

      if (petPower?.ability === 'meme-magic' && hasTraded && Math.random() < 0.2) {
        const memeBonus = Math.random() > 0.5 ? 3 : -2;
        setBalance((prev) => Math.max(0, prev + memeBonus));
        setPetBonusText(memeBonus > 0 ? '🐕 Much wow! +$3' : '🐕 Oopsie meme dip: -$2');
      }

      if (priceFreezeNext) {
        setPriceFreezeNext(false);
      }
    } catch (error) {
      console.error('Failed to fetch prices:', error);
    }
  }, [hasTraded, petPower, portfolio, priceFreezeNext, settings.difficulty, stocks]);

  const triggerAchievement = (amount, isGoal = false) => {
    const achievements = {
      25: { title: "First Steps!", emoji: "🎉", xp: 50, description: "You made your first $25!" },
      50: { title: "Getting Started!", emoji: "🚀", xp: 100, description: "Halfway to your first $100!" },
      75: { title: "Money Maker!", emoji: "💰", xp: 150, description: "You're on fire! Keep going!" },
      100: { title: "Doubled Up!", emoji: "🎯", xp: 250, description: "You doubled your starting money!" },
      150: { title: "Expert Trader!", emoji: "📈", xp: 400, description: "Almost at your goal!" },
      200: { title: "GOAL ACHIEVED!", emoji: "🏆", xp: 1000, description: "You reached $200! You're a trading master!" }
    };
    const fallback = { title: 'GOAL ACHIEVED!', emoji: '🏆', xp: 1000, description: `You reached $${amount}! Incredible work!` };
    
    setCurrentAchievement(achievements[amount] || fallback);
    setShowAchievement(true);
    setUnlockedAchievements(prev => [...prev, amount]);

    if (settings.soundEnabled) {
      if (isGoal) {
        sounds.goalReached();
      } else {
        sounds.milestone();
      }
    }
  };
  
  // Fetch stock prices on mount and every X seconds (based on experience level)
  // Volatility is controlled by difficulty setting passed to fetchPrices
  useEffect(() => {
    // Beginner: 20 seconds (slower, easier to react)
    // Intermediate: 15 seconds (balanced)
    // Expert: 10 seconds (faster, more challenging)
    const updateInterval = userData?.experience === 'beginner' ? 300000 :
                userData?.experience === 'expert' ? 180000 :
                240000;

    fetchPrices();
    const interval = setInterval(fetchPrices, updateInterval);
    return () => clearInterval(interval);
  }, [userData?.experience, settings.difficulty, fetchPrices]);

  // Load transaction history from Firestore on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await loadTransactionHistory();
        if (history && history.length > 0) {
          setTradeHistory(history.map(t => ({
            type: t.type,
            name: t.stockName,
            emoji: t.emoji,
            price: t.price,
            profit: t.profit,
            time: new Date(t.timestamp).toLocaleTimeString()
          })));
        }
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    }
    loadHistory();
  }, [loadTransactionHistory]);
  
  // Check for achievements
  useEffect(() => {
    if (balance >= GOAL && lastBalance < GOAL) {
      setShowConfetti(true);
      triggerAchievement(GOAL, true);
    }
    
    // Check for milestone achievements
    for (const milestone of MILESTONES) {
      if (balance >= milestone && lastBalance < milestone && !unlockedAchievements.includes(milestone)) {
        triggerAchievement(milestone);
        break; // Only trigger one at a time
      }
    }
  }, [balance, GOAL, MILESTONES, lastBalance, unlockedAchievements]);
  
  useEffect(() => {
    setLastBalance(balance);
  }, [balance]);
  
  const handleBuy = async (stockId) => {
    const stock = stocks.find(s => s.id === stockId) || (moonshotStock?.id === stockId ? moonshotStock : null);

    if (!stock) return;

    const price = getBuyPrice(stock);
    if (petDiscountRemaining > 0) {
      setPetDiscountRemaining((prev) => Math.max(0, prev - 1));
    }

    if (balance < price) {
      return;
    }

    try {
      // Update locally first for instant feedback
      const newBalance = balance - stock.price;
      const newPortfolio = {
        ...portfolio,
        [stockId]: (portfolio[stockId] || 0) + 1
      };

      setBalance(newBalance);
      setPortfolio(newPortfolio);

      // Add to history
      setTradeHistory(prev => [{
        type: 'BUY',
        name: stock.name,
        emoji: stock.emoji,
        price: price,
        time: new Date().toLocaleTimeString()
      }, ...prev]);

      // Save to Firestore
      await saveGameState(newBalance, newPortfolio);
      await saveTransaction('BUY', stock.name, stock.emoji, stock.price);

      // Update leaderboard
      const newPortfolioValue = stocks.reduce((sum, s) => {
        const owned = newPortfolio[s.id] || 0;
        return sum + (owned * s.price);
      }, 0);
      await updateLeaderboardEntry(newBalance + newPortfolioValue, newPortfolioValue);

      // Call backend API (optional - for external stock service)
      await buyStock(stockId);
    } catch (error) {
      console.error('Buy failed:', error);
      setBalance(balance);
    }
  };

  const handleSell = async (stockId) => {
    const stock = stocks.find(s => s.id === stockId) || (moonshotStock?.id === stockId ? moonshotStock : null);
    const owned = portfolio[stockId] || 0;

    if (owned === 0) {
      return;
    }

    try {
      const baseProfit = stock.price - (stock.initialPrice || stock.price);
      const profit = petPower?.key === 'elon' ? baseProfit * 2 : baseProfit;
      const newBalance = balance + stock.price + (petPower?.key === 'elon' ? baseProfit : 0);
      const newPortfolio = {
        ...portfolio,
        [stockId]: owned - 1
      };

      setBalance(newBalance);
      setPortfolio(newPortfolio);

      // Add to history
      setTradeHistory(prev => [{
        type: 'SELL',
        name: stock.name,
        emoji: stock.emoji,
        price: stock.price,
        profit: profit,
        time: new Date().toLocaleTimeString()
      }, ...prev]);

      // Save to Firestore
      await saveGameState(newBalance, newPortfolio);
      await saveTransaction('SELL', stock.name, stock.emoji, stock.price, profit);

      // Update leaderboard
      const newPortfolioValue = stocks.reduce((sum, s) => {
        const owned = newPortfolio[s.id] || 0;
        return sum + (owned * s.price);
      }, 0);
      await updateLeaderboardEntry(newBalance + newPortfolioValue, newPortfolioValue);

      // Call backend API (optional - for external stock service)
      await sellStock(stockId);
    } catch (error) {
      console.error('Sell failed:', error);
      setBalance(balance);
    }
  };
  
  const totalPortfolioValue = [...stocks, ...(moonshotStock ? [moonshotStock] : [])].reduce((sum, stock) => {
    const owned = portfolio[stock.id] || 0;
    return sum + (owned * stock.price);
  }, 0);
  
  const netWorth = balance + totalPortfolioValue;
  
  // Theme colors
  const themes = {
    space: { bg: '#020617', accent: '#8b5cf6', gradient: 'from-blue-400 via-indigo-400 to-emerald-400' },
    neon: { bg: '#0a0a0a', accent: '#ec4899', gradient: 'from-pink-400 via-purple-400 to-cyan-400' },
    ocean: { bg: '#001a2e', accent: '#06b6d4', gradient: 'from-blue-400 via-cyan-400 to-teal-400' },
    forest: { bg: '#0d1f0d', accent: '#10b981', gradient: 'from-green-400 via-emerald-400 to-lime-400' }
  };
  
  const currentTheme = themes[settings.theme] || themes.space;

  useEffect(() => {
    if (petPower?.ability === 'safety-net' && balance < 50) {
      setBalance(50);
      setPetBonusText('🔥 Phoenix Revival: back to $50!');
    }
  }, [balance, petPower?.ability]);

  useEffect(() => {
    if (petPower?.ability === 'interest-gain' && hasTraded) {
      const interval = setInterval(() => {
        setBalance((prev) => prev + prev * 0.01);
        setPetBonusText('🐉 Dragon Interest: +1% cash');
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [petPower?.ability, hasTraded]);

  useEffect(() => {
    if (!petPower) return;
    const badges = {};
    if (petPower.key === 'warren') {
      stocks.forEach((stock) => {
        if (petPower.ability(stock) === 'undervalued') {
          badges[stock.id] = { label: 'VALUE!', color: 'emerald' };
        }
      });
    }
    if (petPower.key === 'buffett') {
      stocks.forEach((stock) => {
        badges[stock.id] = { label: petPower.ability(stock) === 'will-rise' ? 'NEXT: UP' : 'NEXT: DOWN', color: 'indigo' };
      });
    }
    if (petPower.key === 'chad') {
      if (stocks.length > 0) {
        const trending = stocks[Math.floor(Math.random() * stocks.length)];
        badges[trending.id] = { label: 'TRENDING', color: 'pink' };
      }
    }
    setStockBadges(badges);
  }, [petPower, stocks]);

  useEffect(() => {
    if (!petBonusText) return;
    const timer = setTimeout(() => setPetBonusText(''), 2500);
    return () => clearTimeout(timer);
  }, [petBonusText]);
  
  const completeSubgoal = (id) => {
    setSubgoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== id || goal.completed) return goal;
        setXp((xpPrev) => xpPrev + goal.reward);
        setPetBonusText(`🏅 +${goal.reward} XP`);
        return { ...goal, completed: true };
      })
    );
  };

  useEffect(() => {
    if (tradeHistory.some((t) => t.type === 'BUY')) {
      completeSubgoal('first-buy');
    }
    if (tradeHistory.some((t) => t.type === 'SELL')) {
      completeSubgoal('first-sell');
    }
    if (tradeHistory.some((t) => t.type === 'SELL' && t.profit > 0)) {
      completeSubgoal('first-profit');
    }
  }, [tradeHistory]);

  useEffect(() => {
    if (showSettings) {
      completeSubgoal('open-settings');
    }
  }, [showSettings]);

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    await fetchPrices();
    setIsManualRefreshing(false);
  };

  const handlePetBoost = (bonus) => {
    completeSubgoal('pet-trick');
    if (!hasTraded) {
      setPetBonusText('🦉 Make a trade first to unlock pet bonuses!');
      return;
    }
    if (bonus?.type === 'coins') {
      setBalance((prev) => prev + bonus.amount);
      setPetBonusText(`🌟 Pet Bonus: +$${bonus.amount}`);
    }
    if (bonus?.type === 'freeze') {
      setPriceFreezeNext(true);
      setPetBonusText('❄️ Pet Freeze: next prices pause!');
    }
    if (bonus?.type === 'discount') {
      setPetDiscountRemaining(1);
      setPetBonusText('🪄 Discount: next BUY is 50% off!');
    }
    if (bonus?.type === 'secret-hoot') {
      setBalance((prev) => prev + 2);
      setPetBonusText('🦉 Secret Hoot: +$2');
    }
  };

  const themeConfig = {
    space: { base: 'bg-[#030712]', blobs: ['bg-indigo-600/20', 'bg-purple-600/20', 'bg-blue-600/20'], grid: 'rgba(99,102,241,0.08)' },
    neon: { base: 'bg-[#0f172a]', blobs: ['bg-fuchsia-600/20', 'bg-cyan-500/20', 'bg-yellow-500/20'], grid: 'rgba(236,72,153,0.08)' },
    ocean: { base: 'bg-[#0f172a]', blobs: ['bg-blue-600/20', 'bg-cyan-600/20', 'bg-sky-500/20'], grid: 'rgba(6,182,212,0.08)' },
    forest: { base: 'bg-[#020617]', blobs: ['bg-emerald-600/20', 'bg-green-600/20', 'bg-lime-500/20'], grid: 'rgba(16,185,129,0.08)' },
  };
  
  const currentBg = themeConfig[settings.theme] || themeConfig.space;

  return (
    <div className="min-h-screen text-white transition-all duration-500 overflow-x-hidden relative" style={{ backgroundColor: 'transparent' }}>
      
      {/* VIBECODED BACKGROUND - BLOBS EDITION */}
      <div className={`fixed inset-0 z-[-1] pointer-events-none overflow-hidden ${currentBg.base} transition-colors duration-700`}>
        
        {/* Blob 1 - Top Left */}
        <div className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-blob ${currentBg.blobs[0]}`}></div>
        
        {/* Blob 2 - Top Right */}
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-blob animation-delay-2000 ${currentBg.blobs[1]}`}></div>
        
        {/* Blob 3 - Bottom Left */}
        <div className={`absolute -bottom-8 left-20 w-[500px] h-[500px] rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-blob animation-delay-4000 ${currentBg.blobs[2]}`}></div>

        {/* Cyber Grid Overlay */}
        <div className="absolute inset-0 transition-all duration-700"
             style={{ 
               backgroundImage: `linear-gradient(${currentBg.grid} 1px, transparent 1px), linear-gradient(90deg, ${currentBg.grid} 1px, transparent 1px)`, 
               backgroundSize: '50px 50px',
               maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
               WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)'
             }}>
        </div>
      </div>

      {/* Top Bar */}
      <header className="sticky top-4 z-40 mx-4 md:mx-8 rounded-3xl backdrop-blur-2xl bg-white/5 border border-white/10 p-4 lg:p-6 shadow-2xl transition-all duration-300">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex flex-col items-center md:items-start group cursor-default">
              <h1 className="text-4xl md:text-5xl font-bold italic tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-blue-400 to-purple-400 drop-shadow-sm group-hover:scale-105 transition-transform duration-300 pointer-events-auto">
                MINI MARKET
              </h1>
              <div className="flex gap-2 mt-3 flex-wrap justify-center">
                <button
                  onClick={() => setShowInteractiveTutorial(true)}
                  className="text-[10px] border border-blue-400/30 text-blue-300 px-4 py-1.5 rounded-full uppercase font-bold tracking-wider hover:bg-blue-500/20 hover:scale-105 transition-all active:scale-95"
                >
                  📚 Tutorial
                </button>
                <button
                  onClick={handleManualRefresh}
                  className="text-[10px] border border-purple-400/30 text-purple-300 px-4 py-1.5 rounded-full uppercase font-bold tracking-wider hover:bg-purple-500/20 hover:scale-105 transition-all flex items-center gap-1 active:scale-95"
                >
                  <RefreshCw className={isManualRefreshing ? 'animate-spin' : ''} size={12} /> Refresh
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-[10px] border border-emerald-400/30 text-emerald-300 px-4 py-1.5 rounded-full uppercase font-bold tracking-wider hover:bg-emerald-500/20 hover:scale-105 transition-all active:scale-95"
                >
                  Edit Goal ⚙️
                </button>
                <button
                  onClick={() => setShowLeaderboard(true)}
                  className="text-[10px] border border-yellow-400/30 text-yellow-300 px-4 py-1.5 rounded-full uppercase font-bold tracking-wider hover:bg-yellow-500/20 hover:scale-105 transition-all flex items-center gap-1 active:scale-95"
                >
                  <Trophy size={12} /> Leaderboard
                </button>
                <button
                  onClick={signOut}
                  className="text-[10px] border border-rose-400/30 text-rose-300 px-4 py-1.5 rounded-full uppercase font-bold tracking-wider hover:bg-rose-500/20 hover:scale-105 transition-all flex items-center gap-1 active:scale-95"
                >
                  <LogOut size={12} /> Sign Out
                </button>
              </div>
            </div>
            
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block"></div>
            
            {/* Big Money Display */}
            <div className="relative group perspective-1000">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600/30 to-purple-600/30 rounded-[2rem] blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative glass-panel bg-gradient-to-br from-white/10 to-white/5 px-8 py-5 rounded-[1.8rem] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl transition-transform duration-300 group-hover:-translate-y-1">
                {/* Shine effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
                
                <div className="relative">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-xl animate-bounce-slow">💰</span>
                    <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-indigo-400 filter drop-shadow-lg">
                      ${balance.toFixed(2)}
                    </h2>
                    {userData?.experience === 'beginner' && (
                      <BeginnerTooltip text="This is your cash! Use it to buy stocks when prices are LOW!" position="top" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium text-indigo-200/70">
                    <div className="w-full bg-slate-900/50 rounded-full h-2 w-24 overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-300" style={{ width: `${Math.min(100, Math.floor((balance / GOAL) * 100))}%` }}></div>
                    </div>
                    <span>{Math.floor((balance / GOAL) * 100)}% to ${GOAL}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Portfolio Mini Display */}
          <div className="glass-panel px-6 py-4 rounded-2xl border border-white/5 shadow-xl hover:bg-white/5 transition-colors duration-300">
            <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-300/60 mb-1">Total Net Worth</p>
            <div className="flex items-baseline gap-3">
              <h3 className="text-2xl font-black text-white bg-clip-text bg-gradient-to-r from-white to-slate-400 text-transparent">${netWorth.toFixed(2)}</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${totalPortfolioValue > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700/50 text-slate-400'}`}>
                +${totalPortfolioValue.toFixed(2)} in stocks
              </span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Settings Dropdown */}
      <SettingsDropdown
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        userData={userData}
        settings={settings}
        onUpdateSettings={setSettings}
        onSaveSettings={saveSettings}
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

      {/* Leaderboard Modal */}
      <Leaderboard
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
      
      
      {/* Main Layout with Side Panel */}
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-140px)] gap-8 p-4 lg:p-8">
        <main className="flex-1">
          {/* Level Progress Card */}
          <div className="glass-panel rounded-[2rem] p-8 border border-white/5 mb-12 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-500 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                    {level}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-indigo-200 uppercase tracking-wider">Current Level</div>
                    <div className="text-xs text-white/40 font-mono">XP {xp} / 100</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Next Level</span>
                </div>
              </div>
              
              <div className="h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/5 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out relative"
                  style={{ width: `${levelProgress}%` }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50 blur-[2px]"></div>
                </div>
              </div>
              
              <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {subgoals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`px-4 py-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all duration-300 ${
                      goal.completed
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                       {goal.completed ? '✅' : '○'} {goal.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md ${goal.completed ? 'bg-emerald-500/20' : 'bg-black/20'}`}>+{goal.reward} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 pb-20">
            {stocks.map((stock, index) => (
              <div key={stock.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <StockCard
                  stock={stock}
                  badge={stockBadges[stock.id]}
                  owned={portfolio[stock.id] || 0}
                  canAfford={balance >= getBuyPrice(stock)}
                  onBuy={handleBuy}
                  onSell={handleSell}
                  theme={currentTheme}
                />
              </div>
            ))}
            {moonshotStock && (
              <div className="animate-fade-in" style={{ animationDelay: `${stocks.length * 0.1}s` }}>
                <StockCard
                  stock={moonshotStock}
                  badge={{ label: 'MOONSHOT', color: 'yellow' }}
                  owned={portfolio[moonshotStock.id] || 0}
                  canAfford={balance >= getBuyPrice(moonshotStock)}
                  onBuy={handleBuy}
                  onSell={handleSell}
                  theme={currentTheme}
                />
              </div>
            )}
          </div>
          
          {stocks.length === 0 && !moonshotStock && (
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
        stocks={[...stocks, ...(moonshotStock ? [moonshotStock] : [])]}
        balance={balance}
        userData={userData}
        portfolio={portfolio}
        personality={settings.petPersonality}
        theme={settings.theme}
        petName={userData?.petName}
        petPower={petPower}
        onPetBoost={handlePetBoost}
      />

      {/* Interactive Tutorial */}
      {showInteractiveTutorial && (
        <InteractiveTutorial 
          experience={userData?.experience || 'beginner'}
          onComplete={() => {
            localStorage.setItem('mm_tutorial_completed', 'true');
            setShowInteractiveTutorial(false);
          }}
          onClose={() => {
            localStorage.setItem('mm_tutorial_completed', 'true');
            setShowInteractiveTutorial(false);
          }}
          theme={settings.theme}
          onOpenSettings={() => setShowSettings(true)}
          onPreviewTheme={(themeId) => setSettings((prev) => ({ ...prev, theme: themeId }))}
        />
      )}

      {petBonusText && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 border border-white/10 px-6 py-3 rounded-full text-xs font-bold text-white shadow-2xl animate-fade-in">
          {petBonusText}
        </div>
      )}
    </div>
  );
}

export default Dashboard;