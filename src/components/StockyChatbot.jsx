import React, { useState, useRef, useEffect } from 'react';
import { X, Send, BrainCircuit } from 'lucide-react';
import { getStockyResponse } from '../utils/ai';

const StockyChatbot = ({ stocks, balance, userData, portfolio }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hoot! I'm Stocky, your AI trading mentor. Ask me about buying, risks, or how to reach your goal!", sender: 'stocky' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bubbleText, setBubbleText] = useState("Need help? Click Stocky!");
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    
    // Get AI-powered reply
    const reply = await getStockyResponse(input, stocks, balance, portfolio, userData);
    
    setMessages(prev => [...prev, { text: reply, sender: 'stocky' }]);
    setIsLoading(false);
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
            <div className='flex items-center gap-2'>
              <BrainCircuit className='w-4 h-4 text-blue-400' />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Stocky AI Mentor</span>
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
          <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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
