import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

const StockyChatbot = ({ stocks, balance, userData, portfolio }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hoot! I'm Stocky, your AI trading mentor. Ask me about buying, risks, or how to reach your goal!", sender: 'stocky' }
  ]);
  const [input, setInput] = useState('');
  const [bubbleText, setBubbleText] = useState("Need help? Click Stocky!");
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const getStockyReply = (msg) => {
    const lower = msg.toLowerCase();
    
    // Greetings
    if (lower.match(/^(hi|hello|hey|sup|yo)/)) {
      return `Hoot hoot! Hey ${userData?.name || 'friend'}! Ready to make some smart trades today? 🦉`;
    }
    
    // Who are you
    if (lower.includes('who') && (lower.includes('you') || lower.includes('stocky'))) {
      return "I'm Stocky, your Vantage AI Mentor! I'm here to help you become a finance pro and reach your goal! 🎯";
    }
    
    // Buying advice
    if (lower.includes('buy') || lower.includes('when')) {
      const greenStocks = stocks.filter(s => s.trend === 'up');
      const redStocks = stocks.filter(s => s.trend === 'down');
      if (redStocks.length > 0) {
        return `🦉 Stocky's tip: I see ${redStocks[0].name} ${redStocks[0].emoji} is down! This could be a good time to buy low and sell high later. Remember: Buy RED, Sell GREEN!`;
      }
      return "Hoot! Watch for stocks with DOWN arrows (🔻). That means they're cheaper right now. Buy low, sell high! 💰";
    }
    
    // Selling advice
    if (lower.includes('sell')) {
      const ownedStocks = Object.keys(portfolio).filter(id => portfolio[id] > 0);
      if (ownedStocks.length > 0) {
        const stock = stocks.find(s => s.id === ownedStocks[0]);
        if (stock && stock.trend === 'up') {
          return `🦉 Great timing! Your ${stock.name} ${stock.emoji} is UP! Selling now = PROFIT! 📈`;
        }
        return `You own some stocks! Wait for the UP arrow (🔺) to appear, then sell for maximum profit! 💚`;
      }
      return "Hoot! You don't own any stocks yet. Buy some first, then sell when prices go up! 📊";
    }
    
    // Risk questions
    if (lower.includes('risk') || lower.includes('safe') || lower.includes('dangerous')) {
      return "🦉 Stocky says: Stocks with BIG price swings are HIGH risk but can make more money! Start with LOW risk stocks to learn, then try riskier ones. Balance is key!";
    }
    
    // Goal questions
    if (lower.includes('goal') || lower.includes('target') || lower.includes('win')) {
      const goal = userData?.goalAmount || 200;
      const totalWorth = balance + stocks.reduce((sum, s) => sum + (portfolio[s.id] || 0) * s.price, 0);
      const remaining = Math.max(0, goal - totalWorth);
      if (remaining === 0) {
        return `🎉 AMAZING! You reached your goal! You're officially a Mini Market PRO! Keep trading to go even higher! 🏆`;
      }
      return `Your goal is to reach $${goal}! You need $${remaining.toFixed(2)} more. Keep making smart trades - you've got this! 💪`;
    }
    
    // Balance questions
    if (lower.includes('money') || lower.includes('cash') || lower.includes('balance')) {
      if (balance < 10) {
        return `🦉 Hoot! You're low on cash ($${balance.toFixed(2)}). Sell some stocks to free up money for new trades! 💵`;
      }
      return `You have $${balance.toFixed(2)} in cash. That's ${Math.floor(balance / 10)} potential trades at $10 each! Use it wisely! 🧠`;
    }
    
    // Stock specific questions
    stocks.forEach(stock => {
      if (lower.includes(stock.name.toLowerCase()) || lower.includes(stock.emoji)) {
        const owned = portfolio[stock.id] || 0;
        return `${stock.emoji} ${stock.name} is at $${stock.price.toFixed(2)} right now. You own ${owned} shares. ${stock.trend === 'up' ? 'It\'s going UP! 📈' : stock.trend === 'down' ? 'It\'s going DOWN! 📉' : 'Stable for now.'}`;
      }
    });
    
    // Help/tutorial
    if (lower.includes('help') || lower.includes('how') || lower.includes('start')) {
      return "🦉 Here's how to play:\n1️⃣ Buy stocks when prices are LOW (red/down)\n2️⃣ Watch prices change every 15 seconds\n3️⃣ Sell when prices go UP (green) for profit\n4️⃣ Reach your goal = YOU WIN! 🎯";
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
      return tips[Math.floor(Math.random() * tips.length)];
    }
    
    // Thank you
    if (lower.includes('thank') || lower.includes('thanks')) {
      return "Hoot hoot! You're welcome! That's what mentors are for! Keep up the great trading! 🦉💙";
    }
    
    // Default responses
    const defaults = [
      "Hoot! That's a great question. Try asking about: buying, selling, risks, your goal, or specific stocks! 🦉",
      "🦉 I'm here to help! Ask me about trading strategy, which stocks to buy, or how to reach your goal!",
      "Interesting! Want to know about buying strategies, risk levels, or your current portfolio? Just ask! 📊"
    ];
    
    return defaults[Math.floor(Math.random() * defaults.length)];
  };
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    
    // Get Stocky's reply
    setTimeout(() => {
      const reply = getStockyReply(input);
      setMessages(prev => [...prev, { text: reply, sender: 'stocky' }]);
    }, 600);
    
    setInput('');
  };
  
  const showAutomatedTip = (text) => {
    setBubbleText(text);
    setTimeout(() => setBubbleText("Need help? Click Stocky!"), 5000);
  };
  
  // Auto tips based on game state
  useEffect(() => {
    if (balance < 10 && !isOpen) {
      showAutomatedTip("Hoot! Running low on cash? 💸");
    }
  }, [balance]);
  
  return (
    <div className="fixed bottom-10 right-10 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="glass-panel w-96 h-[32rem] mb-4 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl border-blue-500/30 animate-fade-in">
          {/* Header */}
          <div className="bg-blue-600/20 p-4 border-b border-white/10 flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Stocky AI Mentor</span>
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
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Stocky anything..."
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-500 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Floating Button */}
      <div className="flex items-center gap-4">
        {!isOpen && (
          <div className="glass-panel p-4 rounded-[2rem] rounded-br-none text-[10px] font-bold max-w-[200px] border border-blue-500/40 shadow-2xl animate-fade-in">
            {bubbleText}
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-8xl cursor-pointer hover:scale-110 transition-transform animate-bounce-slow"
          style={{ filter: 'drop-shadow(0 10px 30px rgba(59, 130, 246, 0.3))' }}
        >
          🦉
        </button>
      </div>
    </div>
  );
};

export default StockyChatbot;
