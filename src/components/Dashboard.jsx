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
import PetCompanion from './PetCompanion';
import { getStockPrices, buyStock, sellStock } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { getPetPower } from '../utils/petPowers';

function Dashboard({ userData }) {
  const { signOut, saveGameState, saveTransaction, loadTransactionHistory, updateLeaderboardEntry } = useAuth();

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
    soundEnabled: true,
    theme: userData?.theme || 'space',
    petPersonality: userData?.petPersonality || 'friendly',
    difficulty: userData?.experience === 'expert' ? 'hard' : userData?.experience === 'intermediate' ? 'medium' : 'easy',
    goalAmount: userData?.goalAmount || 200
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
  const MILESTONES = useMemo(() => [25, 50, 75, 100, 150, 200], []);
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

  const triggerAchievement = (amount) => {
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
  };
  
  // Fetch stock prices on mount and every 60 seconds
  useEffect(() => {
    const updateInterval = 60000;

    fetchPrices();
    const interval = setInterval(fetchPrices, updateInterval);
    return () => clearInterval(interval);
  }, [fetchPrices]);

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
      triggerAchievement(GOAL);
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
      const newBalance = balance - price;
      const newPortfolio = {
        ...portfolio,
        [stockId]: (portfolio[stockId] || 0) + 1
      };

      setBalance(newBalance);
      setPortfolio(newPortfolio);

      setTradeHistory(prev => [{
        type: 'BUY',
        name: stock.name,
        emoji: stock.emoji,
        price: price,
        time: new Date().toLocaleTimeString()
      }, ...prev]);

      await saveGameState(newBalance, newPortfolio);
      await saveTransaction('BUY', stock.name, stock.emoji, price);

      const newPortfolioValue = [...stocks, ...(moonshotStock ? [moonshotStock] : [])].reduce((sum, s) => {
        const owned = newPortfolio[s.id] || 0;
        return sum + (owned * s.price);
      }, 0);
      await updateLeaderboardEntry(newBalance + newPortfolioValue, newPortfolioValue);

      await buyStock(stockId);
    } catch (error) {
      console.error('Buy failed:', error);
      setBalance(balance);
    }
  };

  const handleSell = async (stockId) => {
    const stock = stocks.find(s => s.id === stockId) || (moonshotStock?.id === stockId ? moonshotStock : null);
    const owned = portfolio[stockId] || 0;

    if (owned === 0 || !stock) {
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

      setTradeHistory(prev => [{
        type: 'SELL',
        name: stock.name,
        emoji: stock.emoji,
        price: stock.price,
        profit: profit,
        time: new Date().toLocaleTimeString()
      }, ...prev]);

      await saveGameState(newBalance, newPortfolio);
      await saveTransaction('SELL', stock.name, stock.emoji, stock.price, profit);

      const newPortfolioValue = [...stocks, ...(moonshotStock ? [moonshotStock] : [])].reduce((sum, s) => {
        const owned = newPortfolio[s.id] || 0;
        return sum + (owned * s.price);
      }, 0);
      await updateLeaderboardEntry(newBalance + newPortfolioValue, newPortfolioValue);

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

  return (
    <div
      className="min-h-screen font-['Lexend'] text-white transition-colors duration-500"
      style={{ backgroundColor: currentTheme.bg }}
    >
      {/* Top Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/10 p-6 shadow-2xl" style={{ backgroundColor: `${currentTheme.bg}90` }}>
        <div className="max-w-400 mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div>
              <h1 className={`text-4xl font-black italic text-transparent bg-clip-text bg-linear-to-r ${currentTheme.gradient} uppercase tracking-tighter leading-none animate-pulse`}>
                MINI MARKET
              </h1>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setShowInteractiveTutorial(true)}
                  className="text-[10px] border border-blue-500/50 text-blue-400 px-3 py-1 rounded-full uppercase font-bold hover:bg-blue-500/10 transition animate-bounce"
                >
                  📚 Tutorial
                </button>
                <button
                  onClick={handleManualRefresh}
                  className="text-[10px] border border-purple-500/50 text-purple-300 px-3 py-1 rounded-full uppercase font-bold hover:bg-purple-500/10 transition flex items-center gap-1"
                >
                  <RefreshCw className={isManualRefreshing ? 'animate-spin' : ''} size={12} /> Refresh
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-[10px] border border-emerald-500/50 text-emerald-400 px-3 py-1 rounded-full uppercase font-bold hover:bg-emerald-500/10 transition"
                >
                  ⚙️ Settings
                </button>
                <button
                  onClick={() => setShowLeaderboard(true)}
                  className="text-[10px] border border-yellow-500/50 text-yellow-400 px-3 py-1 rounded-full uppercase font-bold hover:bg-yellow-500/10 transition flex items-center gap-1"
                >
                  <Trophy size={12} /> Leaderboard
                </button>
                <button
                  onClick={signOut}
                  className="text-[10px] border border-red-500/50 text-red-400 px-3 py-1 rounded-full uppercase font-bold hover:bg-red-500/10 transition flex items-center gap-1"
                >
                  <LogOut size={12} /> Sign Out
                </button>
              </div>
            </div>
            
            <div className="h-10 w-px bg-white/10 hidden md:block"></div>
            
            {/* Big Money Display */}
            <div className="glass-panel px-8 py-6 rounded-3xl border-4 shadow-2xl relative overflow-hidden" style={{ borderColor: currentTheme.accent }}>
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 animate-pulse" style={{ background: `linear-gradient(45deg, ${currentTheme.accent}, transparent)` }}></div>
              </div>
              
              <div className="relative">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm text-white/60 font-bold">💰</span>
                  <h2 className="text-5xl font-black tracking-tight animate-pulse" style={{ color: currentTheme.accent }}>
                    ${balance.toFixed(2)}
                  </h2>
                  {userData?.experience === 'beginner' && (
                    <BeginnerTooltip text="This is your cash! Use it to buy stocks when prices are LOW!" position="top" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span>Goal</span>
                  <span className="text-emerald-300 font-bold">${GOAL}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{Math.floor((balance / GOAL) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Portfolio Mini Display */}
          <div className="glass-panel px-6 py-4 rounded-2xl border-2 border-white/10 shadow-xl">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Total Worth</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-white">${netWorth.toFixed(2)}</h3>
              <span className="text-xs text-slate-400">+${totalPortfolioValue.toFixed(2)} stocks</span>
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
      <div className="max-w-400 mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-140px)]">
        <main className="flex-1 p-8">
          <div className="glass-panel rounded-3xl p-6 border border-white/10 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-black text-white">Level {level}</div>
              <div className="text-xs text-white/50">XP {xp}</div>
            </div>
            <div className="h-3 bg-slate-900/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-3">
              {subgoals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between ${
                    goal.completed
                      ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-200'
                      : 'bg-slate-800/50 border-slate-700 text-white/70'
                  }`}
                >
                  <span>{goal.title}</span>
                  <span>+{goal.reward} XP</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {stocks.map(stock => (
              <StockCard
                key={stock.id}
                stock={stock}
                badge={stockBadges[stock.id]}
                owned={portfolio[stock.id] || 0}
                canAfford={balance >= getBuyPrice(stock)}
                onBuy={handleBuy}
                onSell={handleSell}
                theme={currentTheme}
              />
            ))}
            {moonshotStock && (
              <StockCard
                key={moonshotStock.id}
                stock={moonshotStock}
                badge={{ label: 'MOONSHOT', color: 'yellow' }}
                owned={portfolio[moonshotStock.id] || 0}
                canAfford={balance >= getBuyPrice(moonshotStock)}
                onBuy={handleBuy}
                onSell={handleSell}
                theme={currentTheme}
              />
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
      />
      
      {/* Pet Companion */}
      <PetCompanion 
        petName={userData?.petName}
        petPower={petPower}
        balance={balance}
        theme={settings.theme}
        personality={settings.petPersonality}
        onPetBoost={(bonus) => {
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
        }}
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