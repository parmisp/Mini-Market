import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { getStockyResponse } from '../utils/ai';
import { speakAsStocky, stopSpeech } from '../utils/speech';

function OwlButtonModel() {
  const { scene } = useGLTF('/owl.glb');
  return <primitive object={scene} scale={2.2} position={[0, -0.05, 0]} />;
}

const StockyChatbot = ({
  stocks,
  balance,
  userData,
  portfolio,
  personality = 'friendly',
  theme = 'space',
  petName,
  petPower,
  onPetBoost
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hoot! I'm Stocky, your AI trading mentor. Ask me about buying, risks, or how to reach your goal!", sender: 'stocky' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bubbleText, setBubbleText] = useState("Need help? Click Stocky!");
  const [petCooldown, setPetCooldown] = useState(false);
  const [petMessage, setPetMessage] = useState('Tap for a pet trick!');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [lastTip, setLastTip] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => stopSpeech();
  }, []);
  
  const personalityTone = {
    friendly: { prefix: '😊', suffix: 'You’ve got this!' },
    wise: { prefix: '🧙', suffix: 'Patience grows profits.' },
    silly: { prefix: '🤪', suffix: 'Boop! Markets are weird.' }
  };

  const tone = personalityTone[personality] || personalityTone.friendly;

  const withTone = (text) => `${tone.prefix} ${text} ${tone.suffix}`;

  const getStockyReply = (msg) => {
    const lower = msg.toLowerCase();
    
    // Greetings
    if (lower.match(/^(hi|hello|hey|sup|yo)/)) {
      return withTone(`Hoot hoot! Hey ${userData?.name || 'friend'}! Ready to make smart trades today? 🦉`);
    }
    
    // Who are you
    if (lower.includes('who') && (lower.includes('you') || lower.includes('stocky'))) {
      return withTone("I'm Stocky, your AI mentor! I'm here to help you reach your goal! 🎯");
    }
    
    // Buying advice
    if (lower.includes('buy') || lower.includes('when')) {
      const greenStocks = stocks.filter(s => s.trend === 'up');
      const redStocks = stocks.filter(s => s.trend === 'down');
      if (redStocks.length > 0) {
        return withTone(`Tip: ${redStocks[0].name} ${redStocks[0].emoji} is down! That can be a good time to buy low and sell high later.`);
      }
      return withTone("Watch for DOWN arrows (🔻). That means they’re cheaper right now. Buy low, sell high! 💰");
    }
    
    // Selling advice
    if (lower.includes('sell')) {
      const ownedStocks = Object.keys(portfolio).filter(id => portfolio[id] > 0);
      if (ownedStocks.length > 0) {
        const stock = stocks.find(s => s.id === ownedStocks[0]);
        if (stock && stock.trend === 'up') {
          return withTone(`Great timing! Your ${stock.name} ${stock.emoji} is UP! Selling now = profit! 📈`);
        }
        return withTone('You own some stocks! Wait for the UP arrow (🔺), then sell for profit! 💚');
      }
      return withTone("You don't own any stocks yet. Buy some first, then sell when prices go up! 📊");
    }
    
    // Risk questions
    if (lower.includes('risk') || lower.includes('safe') || lower.includes('dangerous')) {
      return withTone("Stocks with BIG price swings are high risk but can make more money! Start with low risk to learn, then try riskier ones.");
    }
    
    // Goal questions
    if (lower.includes('goal') || lower.includes('target') || lower.includes('win')) {
      const goal = userData?.goalAmount || 200;
      const totalWorth = balance + stocks.reduce((sum, s) => sum + (portfolio[s.id] || 0) * s.price, 0);
      const remaining = Math.max(0, goal - totalWorth);
      if (remaining === 0) {
        return withTone('AMAZING! You reached your goal! You’re a Mini Market PRO! 🏆');
      }
      return withTone(`Your goal is $${goal}. You need $${remaining.toFixed(2)} more. Keep making smart trades! 💪`);
    }
    
    // Balance questions
    if (lower.includes('money') || lower.includes('cash') || lower.includes('balance')) {
      if (balance < 10) {
        return `🦉 Hoot! You're low on cash ($${balance.toFixed(2)}). Sell some stocks to free up money for new trades! 💵`;
      }
      return withTone(`You have $${balance.toFixed(2)} in cash. That’s about ${Math.floor(balance / 10)} trades at $10 each!`);
    }
    
    // Stock specific questions
    stocks.forEach(stock => {
      if (lower.includes(stock.name.toLowerCase()) || lower.includes(stock.emoji)) {
        const owned = portfolio[stock.id] || 0;
        return withTone(`${stock.emoji} ${stock.name} is at $${stock.price.toFixed(2)}. You own ${owned} shares. ${stock.trend === 'up' ? 'It\'s going UP! 📈' : stock.trend === 'down' ? 'It\'s going DOWN! 📉' : 'Stable for now.'}`);
      }
    });
    
    // Help/tutorial
    if (lower.includes('help') || lower.includes('how') || lower.includes('start')) {
      return withTone("Here's how to play:\n1️⃣ Buy when prices are LOW\n2️⃣ Watch prices change\n3️⃣ Sell when prices go UP\n4️⃣ Reach your goal = YOU WIN! 🎯");
    }
    
    // Strategy questions
    if (lower.includes('strategy') || lower.includes('tip') || lower.includes('advice')) {
      const tips = [
        "🦉 Don't put all your money in one stock! Spread it around to reduce risk.",
        "🦉 Be patient! Prices change every 15 seconds. Wait for the right moment!",
        "🦉 If a stock keeps going down, it might go back up later. Don't panic!",
        "🦉 Track which stocks you own. Sell the profitable ones when they're GREEN!",
        "🦉 Low-risk stocks move slower but are safer. High-risk = big swings! Choose wisely!"
      ];
      return withTone(tips[Math.floor(Math.random() * tips.length)]);
    }
    
    // Thank you
    if (lower.includes('thank') || lower.includes('thanks')) {
      return withTone("You're welcome! Keep up the great trading! 🦉💙");
    }
    
    // Default responses
    const defaults = [
      "Hoot! That's a great question. Try asking about: buying, selling, risks, your goal, or specific stocks! 🦉",
      "🦉 I'm here to help! Ask me about trading strategy, which stocks to buy, or how to reach your goal!",
      "Interesting! Want to know about buying strategies, risk levels, or your current portfolio? Just ask! 📊"
    ];
    
    return withTone(defaults[Math.floor(Math.random() * defaults.length)]);
  };
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiReply = await getStockyResponse(input, stocks, balance, portfolio, userData);
    const reply = aiReply || getStockyReply(input);
    setMessages(prev => [...prev, { text: reply, sender: 'stocky' }]);
    setIsLoading(false);
  };

  const handleSpeak = async (text) => {
    if (!audioEnabled || !text) return;
    setIsSpeaking(true);
    await speakAsStocky(text);
    setTimeout(() => setIsSpeaking(false), Math.max(1200, text.length * 60));
  };

  const toggleAudio = () => {
    setAudioEnabled((prev) => {
      if (prev) stopSpeech();
      return !prev;
    });
  };
  
  const showAutomatedTip = (text) => {
    setBubbleText(text);
    setLastTip(text);
    if (audioEnabled) handleSpeak(text);
    setTimeout(() => setBubbleText("Need help? Click Stocky!"), 5000);
  };
  
  // Auto tips based on game state
  useEffect(() => {
    if (balance < 10 && !isOpen) {
      showAutomatedTip("Hoot! Running low on cash? 💸");
    }
  }, [balance]);

  useEffect(() => {
    if (isOpen) return;

    const tips = [
      `🦉 ${petName || 'Your pet'} says: Watch for DOWN arrows, then buy low!`,
      `🦉 ${petName || 'Your pet'} tip: Don’t spend all your cash at once.`,
      `🦉 ${petName || 'Your pet'} hint: Sell when prices go UP for profit!`,
      petPower?.name ? `✨ Pet Power: ${petPower.name} is ready when you are!` : null
    ].filter(Boolean);

    const interval = setInterval(() => {
      const tip = tips[Math.floor(Math.random() * tips.length)];
      if (tip) showAutomatedTip(tip);
    }, 20000);

    return () => clearInterval(interval);
  }, [isOpen, petName, petPower?.name]);

  const handlePetBoost = () => {
    if (petCooldown) return;

    setPetCooldown(true);
    const boosts = [
      { type: 'coins', amount: 2 },
      { type: 'coins', amount: 3 },
      { type: 'discount' },
      { type: 'freeze' }
    ];
    if (petPower?.ability === 'secret-hoot') {
      boosts.push({ type: 'secret-hoot' });
    }
    const bonus = boosts[Math.floor(Math.random() * boosts.length)];
    onPetBoost?.(bonus);
    setPetMessage('✨ Pet Trick activated!');
    setTimeout(() => {
      setPetCooldown(false);
      setPetMessage('Tap for a pet trick!');
    }, 4000);
  };
  
  const themeColors = {
    space: { accent: '#8b5cf6', panel: 'bg-indigo-600/20' },
    neon: { accent: '#ec4899', panel: 'bg-pink-600/20' },
    ocean: { accent: '#06b6d4', panel: 'bg-cyan-600/20' },
    forest: { accent: '#10b981', panel: 'bg-emerald-600/20' }
  };
  const themeStyle = themeColors[theme] || themeColors.space;

  return (
    <div className="fixed bottom-10 right-10 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="glass-panel w-96 h-128 mb-4 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl border-blue-500/30 animate-fade-in">
          {/* Header */}
          <div className={`${themeStyle.panel} p-4 border-b border-white/10 flex justify-between items-center`}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">Stocky + Pet</span>
              {petPower?.emoji && (
                <span className="text-sm" title={petPower.name}>{petPower.emoji}</span>
              )}
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl border text-[11px] leading-relaxed ${
                  msg.sender === 'stocky'
                    ? 'bg-white/5 border-white/10 rounded-tl-none mr-8'
                    : 'bg-blue-500/20 border-blue-500/30 rounded-tr-none ml-8 text-right'
                }`}
              >
                {msg.text.split('\n').map((line, j) => (
                  <div key={j}>{line}</div>
                ))}
              </div>
            ))}
            {isLoading && (
              <div className="p-3 rounded-2xl border text-[11px] leading-relaxed bg-white/5 border-white/10 rounded-tl-none mr-8">
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-fast"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-fast delay-100"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-fast delay-200"></div>
                  <span>Stocky is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-4 bg-white/5 border-t border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between text-[10px] text-white/70">
              <span>{petMessage}</span>
              <button
                onClick={handlePetBoost}
                disabled={petCooldown}
                className="px-3 py-1 rounded-full border border-emerald-300/50 text-emerald-200 uppercase font-black tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {petCooldown ? 'Recharging…' : 'Pet Trick ✨'}
              </button>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Stocky anything..."
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Floating Button */}
      <div className="flex items-center gap-4">
        {!isOpen && (
          <div className="glass-panel p-4 rounded-4xl rounded-br-none text-[10px] font-bold max-w-50 border border-blue-500/40 shadow-2xl animate-fade-in">
            <div className="flex items-start gap-2">
              <div className="flex-1">{bubbleText}</div>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleAudio}
                  title={audioEnabled ? 'Mute Stocky' : 'Unmute Stocky'}
                  className={`p-1 rounded-md border ${
                    audioEnabled ? 'border-blue-400/50 text-blue-200' : 'border-white/20 text-white/40'
                  }`}
                >
                  {audioEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => handleSpeak(lastTip)}
                  disabled={!audioEnabled || !lastTip}
                  title="Replay"
                  className="p-1 rounded-md border border-blue-400/50 text-blue-200 disabled:opacity-40"
                >
                  <RotateCcw className={`w-3 h-3 ${isSpeaking ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-24 h-24 rounded-full overflow-hidden border border-blue-500/40 shadow-2xl hover:scale-110 transition-transform animate-bounce-slow bg-slate-900"
          style={{ filter: 'drop-shadow(0 10px 30px rgba(59, 130, 246, 0.3))' }}
          aria-label="Open Stocky"
        >
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 3.5]} />
            <ambientLight intensity={0.9} />
            <directionalLight position={[3, 3, 3]} intensity={1.2} />
            <OwlButtonModel />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
          </Canvas>
        </button>
      </div>
    </div>
  );
};

export default StockyChatbot;
